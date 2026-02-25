"use client";

import { useEffect, useRef } from "react";
import { WS_URL } from "@/lib/utils/constants";
import { useMarketsStore } from "@/stores/markets";
import type { MarketOdds } from "@/lib/stellar/types";

/**
 * WebSocket hook for real-time odds updates.
 * Connects to the backend WS and pushes updates to the Zustand store.
 */
export function useOddsStream(marketId: number): MarketOdds {
  const updateOdds = useMarketsStore((s) => s.updateOdds);
  const odds = useMarketsStore((s) => s.oddsMap[marketId]) ?? {
    yes: 0.5,
    no: 0.5,
  };
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/ws/odds?market=${marketId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data: MarketOdds = JSON.parse(event.data);
        updateOdds(marketId, data);
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onerror = () => {
      // Will auto-reconnect on close
    };

    ws.onclose = () => {
      // Reconnect after 3 seconds
      setTimeout(() => {
        if (wsRef.current === ws) {
          // Only reconnect if this is still the active connection
          const newWs = new WebSocket(
            `${WS_URL}/ws/odds?market=${marketId}`,
          );
          newWs.onmessage = ws.onmessage;
          newWs.onerror = ws.onerror;
          newWs.onclose = ws.onclose;
          wsRef.current = newWs;
        }
      }, 3000);
    };

    return () => {
      const currentWs = wsRef.current;
      wsRef.current = null;
      currentWs?.close();
    };
  }, [marketId, updateOdds]);

  return odds;
}
