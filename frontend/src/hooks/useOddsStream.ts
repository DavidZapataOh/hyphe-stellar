"use client";

import { useEffect, useRef } from "react";
import { WS_URL } from "@/lib/utils/constants";
import { useMarketsStore } from "@/stores/markets";
import { AmmContract } from "@/lib/stellar/contracts";
import { pricesToOdds } from "@/lib/stellar/parsers";
import type { MarketOdds } from "@/lib/stellar/types";

/**
 * Real-time odds stream — chain-first with WebSocket upgrade.
 *
 * 1. On mount, reads prices directly from the AMM contract (chain = truth)
 * 2. Connects WebSocket for real-time push updates (upgrade, not requirement)
 * 3. If WebSocket fails, falls back to polling the chain every 15s
 *
 * This guarantees real prices even when the backend is down or using a different DB.
 */
export function useOddsStream(marketId: number): MarketOdds {
  const updateOdds = useMarketsStore((s) => s.updateOdds);
  const seedOddsFromChain = useMarketsStore((s) => s.seedOddsFromChain);
  const odds = useMarketsStore((s) => s.oddsMap[marketId]) ?? {
    yes: 0.5,
    no: 0.5,
  };
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Step 1: Seed from chain on mount
  useEffect(() => {
    let cancelled = false;

    async function seedFromChain() {
      try {
        const prices = await AmmContract.getPrices(marketId);
        if (!cancelled) {
          const chainOdds = pricesToOdds(prices);
          seedOddsFromChain(marketId, chainOdds.yes, chainOdds.no);
        }
      } catch {
        // Chain read failed — odds stay at whatever they were
      }
    }

    seedFromChain();
    return () => { cancelled = true; };
  }, [marketId, seedOddsFromChain]);

  // Step 2: WebSocket for real-time, fallback to chain polling
  useEffect(() => {
    let wsConnected = false;

    const ws = new WebSocket(`${WS_URL}/ws/odds?market=${marketId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      wsConnected = true;
      // Clear polling if WS connects successfully
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      try {
        const data: MarketOdds = JSON.parse(event.data);
        updateOdds(marketId, data);
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onerror = () => {
      // Start chain polling as fallback
      if (!pollRef.current) {
        pollRef.current = setInterval(async () => {
          try {
            const prices = await AmmContract.getPrices(marketId);
            updateOdds(marketId, pricesToOdds(prices));
          } catch {
            // Silently fail — will retry on next interval
          }
        }, 15_000);
      }
    };

    ws.onclose = () => {
      // Reconnect after 3 seconds
      if (wsRef.current === ws) {
        setTimeout(() => {
          if (wsRef.current === ws) {
            const newWs = new WebSocket(`${WS_URL}/ws/odds?market=${marketId}`);
            newWs.onopen = ws.onopen;
            newWs.onmessage = ws.onmessage;
            newWs.onerror = ws.onerror;
            newWs.onclose = ws.onclose;
            wsRef.current = newWs;
          }
        }, 3000);
      }
    };

    return () => {
      const currentWs = wsRef.current;
      wsRef.current = null;
      currentWs?.close();
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [marketId, updateOdds]);

  return odds;
}
