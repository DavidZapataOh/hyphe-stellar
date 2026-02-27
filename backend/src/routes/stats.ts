import { FastifyInstance } from "fastify";
import { prisma } from "../db/client.js";
import { getVaultTvl } from "../stellar/contracts.js";
import { logger } from "../utils/logger.js";

export async function statsRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /api/stats/summary
   *
   * Aggregated platform statistics computed from the DB.
   * The backend acts as a keeper/indexer — these numbers come from
   * indexed on-chain events, NOT fabricated data.
   */
  app.get("/api/stats/summary", async () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      activeMarkets,
      totalMarkets,
      totalTradesCount,
      trades24h,
      volume24hResult,
      totalVolumeResult,
      tvlLive,
    ] = await Promise.all([
      // Active (OPEN) markets
      prisma.market.count({ where: { status: "OPEN" } }),

      // Total markets ever created
      prisma.market.count(),

      // Total trades across all markets
      prisma.trade.count(),

      // Trades in last 24h
      prisma.trade.count({
        where: { timestamp: { gte: oneDayAgo } },
      }),

      // 24h volume: sum of trade costs in last 24h
      prisma.trade.aggregate({
        _sum: { cost: true },
        where: { timestamp: { gte: oneDayAgo } },
      }),

      // Total volume: sum of all market totalCollateral
      prisma.market.aggregate({
        _sum: { totalCollateral: true },
      }),

      // Live TVL from chain (fallback to 0)
      getVaultTvl().catch((err) => {
        logger.warn({ err }, "Failed to read live TVL from chain");
        return 0n;
      }),
    ]);

    return {
      activeMarkets,
      totalMarkets,
      totalTrades: totalTradesCount,
      trades24h,
      volume24h: (volume24hResult._sum.cost ?? 0n).toString(),
      totalVolume: (totalVolumeResult._sum.totalCollateral ?? 0n).toString(),
      tvl: tvlLive.toString(),
      timestamp: now.toISOString(),
    };
  });
}
