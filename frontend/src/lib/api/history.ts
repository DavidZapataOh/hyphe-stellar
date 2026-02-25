import { API_URL } from "@/lib/utils/constants";
import type { Market } from "@/lib/stellar/types";

export interface MarketPosition {
  marketId: number;
  question: string;
  outcomes: {
    outcome: number;
    balance: string;
    totalSupply: string;
  }[];
}

/**
 * Fetch a user's positions in a specific market.
 * Backend route: GET /api/markets/:id/positions/:address
 */
export async function fetchUserMarketPositions(
  marketId: number,
  address: string,
): Promise<MarketPosition["outcomes"]> {
  const res = await fetch(
    `${API_URL}/api/markets/${marketId}/positions/${address}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch positions: ${res.status}`);
  const data = await res.json();
  return data.outcomes;
}

/**
 * Fetch all user positions across all open markets.
 * Since the backend doesn't have a single endpoint for all positions,
 * we fetch the market list and then query positions for each.
 */
export async function fetchAllUserPositions(
  address: string,
): Promise<MarketPosition[]> {
  // First get all markets
  const marketsRes = await fetch(`${API_URL}/api/markets`);
  if (!marketsRes.ok) throw new Error(`Failed to fetch markets: ${marketsRes.status}`);
  const markets: Market[] = await marketsRes.json();

  // Then fetch positions for each market in parallel
  const positionPromises = markets.map(async (market) => {
    try {
      const outcomes = await fetchUserMarketPositions(market.id, address);
      const hasPosition = outcomes.some(
        (o) => BigInt(o.balance) > 0n,
      );
      if (!hasPosition) return null;
      return {
        marketId: market.id,
        question: market.question,
        outcomes,
      };
    } catch {
      return null;
    }
  });

  const results = await Promise.all(positionPromises);
  return results.filter((r): r is MarketPosition => r !== null);
}

/**
 * Fetch trade history for a specific market.
 * Backend route: GET /api/markets/:id/trades
 */
export async function fetchMarketTrades(
  marketId: number,
  limit = 50,
) {
  const res = await fetch(
    `${API_URL}/api/markets/${marketId}/trades?limit=${limit}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch trades: ${res.status}`);
  return res.json();
}
