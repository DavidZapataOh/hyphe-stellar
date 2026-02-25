import { API_URL } from "@/lib/utils/constants";
import type { Market, PriceHistoryPoint, TradeEvent } from "@/lib/stellar/types";

export async function fetchMarkets(
  status?: string,
): Promise<Market[]> {
  const params = status && status !== "all" ? `?status=${status}` : "";
  const res = await fetch(`${API_URL}/api/markets${params}`);
  if (!res.ok) throw new Error(`Failed to fetch markets: ${res.status}`);
  return res.json();
}

export async function fetchMarket(marketId: number): Promise<Market> {
  const res = await fetch(`${API_URL}/api/markets/${marketId}`);
  if (!res.ok) throw new Error(`Failed to fetch market ${marketId}: ${res.status}`);
  return res.json();
}

export async function fetchMarketHistory(
  marketId: number,
): Promise<PriceHistoryPoint[]> {
  const res = await fetch(`${API_URL}/api/markets/${marketId}/history`);
  if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
  return res.json();
}

export async function fetchRecentTrades(
  marketId: number,
  limit = 20,
): Promise<TradeEvent[]> {
  const res = await fetch(
    `${API_URL}/api/markets/${marketId}/trades?limit=${limit}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch trades: ${res.status}`);
  return res.json();
}
