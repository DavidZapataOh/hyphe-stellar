"use client";

import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/utils/constants";

export interface PlatformStats {
  activeMarkets: number;
  totalMarkets: number;
  totalTrades: number;
  trades24h: number;
  /** Raw bigint string (USDC 7 decimals) */
  volume24h: string;
  /** Raw bigint string (USDC 7 decimals) */
  totalVolume: string;
  /** Raw bigint string (USDC 7 decimals) */
  tvl: string;
  timestamp: string;
}

/**
 * Hook: fetch aggregated platform stats from the backend keeper.
 * Backend computes these from indexed on-chain events (trades, markets, vault).
 */
export function useStats() {
  return useQuery<PlatformStats>({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/stats/summary`);
      if (!res.ok) throw new Error(`Stats fetch failed: ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
