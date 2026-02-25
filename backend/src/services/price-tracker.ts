import cron from "node-cron";
import { prisma } from "../db/client.js";
import { logger } from "../utils/logger.js";
import { getPrices } from "../stellar/contracts.js";
import { cacheHSet } from "../cache/redis.js";

// LMSR prices are returned as fixed-point with 18 decimals (SCALE = 10^18)
const PRICE_SCALE = 1e18;

/**
 * Snapshot prices for all open markets from the AMM contract.
 * Runs every 1 minute.
 */
async function snapshotPrices(): Promise<void> {
  const openMarkets = await prisma.market.findMany({
    where: { status: "OPEN" },
  });

  for (const market of openMarkets) {
    try {
      const prices = await getPrices(market.id);
      if (prices.length < 2) continue;

      const yesPrice = Number(prices[0]) / PRICE_SCALE;
      const noPrice = Number(prices[1]) / PRICE_SCALE;

      // Save snapshot to DB
      await prisma.priceSnapshot.create({
        data: {
          marketId: market.id,
          yesPrice,
          noPrice,
        },
      });

      // Update Redis cache
      await cacheHSet(`market:${market.id}:prices`, {
        yes: yesPrice.toString(),
        no: noPrice.toString(),
      });
    } catch (error) {
      logger.error(
        { marketId: market.id, error },
        "Price tracker: failed to snapshot"
      );
    }
  }
}

/**
 * Start the price tracker cron job.
 * Snapshots all open market prices every minute.
 */
export function startPriceTracker(): void {
  cron.schedule("* * * * *", async () => {
    try {
      await snapshotPrices();
    } catch (error) {
      logger.error({ error }, "Price tracker cron error");
    }
  });

  logger.info("Price tracker started (every 1 minute)");
}
