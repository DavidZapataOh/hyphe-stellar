"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMarkets } from "@/lib/api/markets";

export function useMarkets(status?: string) {
  return useQuery({
    queryKey: ["markets", status],
    queryFn: () => fetchMarkets(status),
    refetchInterval: 10_000,
  });
}
