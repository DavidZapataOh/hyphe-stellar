"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMarket, fetchMarketHistory, fetchRecentTrades } from "@/lib/api/markets";

export function useMarket(marketId: number) {
  return useQuery({
    queryKey: ["market", marketId],
    queryFn: () => fetchMarket(marketId),
    refetchInterval: 10_000,
  });
}

export function useMarketHistory(marketId: number) {
  return useQuery({
    queryKey: ["market-history", marketId],
    queryFn: () => fetchMarketHistory(marketId),
    refetchInterval: 30_000,
  });
}

export function useRecentTrades(marketId: number) {
  return useQuery({
    queryKey: ["recent-trades", marketId],
    queryFn: () => fetchRecentTrades(marketId),
    refetchInterval: 5_000,
  });
}
