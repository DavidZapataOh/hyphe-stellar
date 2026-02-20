import cron from "node-cron";
import { prisma } from "../db/client.js";
import { logger } from "../utils/logger.js";
import { getMarket, getMarketCount } from "../stellar/contracts.js";
import { scValToNative, xdr } from "@stellar/stellar-sdk";

/**
 * Sync on-chain market state to PostgreSQL.
 * Fetches markets from the factory contract and upserts into DB.
 */
async function syncMarkets(): Promise<void> {
  const count = await getMarketCount();
  if (count === 0) return;

  for (let i = 0; i < count; i++) {
    try {
      const raw = await getMarket(i);
      if (!raw) continue;

      // Parse the ScVal struct into a native object
      const market = scValToNative(raw) as {
        question: string;
        num_outcomes: number;
        end_time: number | bigint;
        resolved: boolean;
        winning_outcome: number | null;
        total_collateral: bigint;
        oracle_id: string;
      };

      const endTime = new Date(Number(market.end_time) * 1000);
      const now = new Date();

      // Determine status
      let status: "OPEN" | "CLOSED" | "RESOLVED" = "OPEN";
      if (market.resolved) {
        status = "RESOLVED";
      } else if (now >= endTime) {
        status = "CLOSED";
      }

      await prisma.market.upsert({
        where: { id: i },
        update: {
          status,
          winningOutcome: market.winning_outcome ?? null,
          totalCollateral: BigInt(market.total_collateral.toString()),
        },
        create: {
          id: i,
          question: market.question,
          numOutcomes: market.num_outcomes,
          endTime,
          status,
          winningOutcome: market.winning_outcome ?? null,
          totalCollateral: BigInt(market.total_collateral.toString()),
        },
      });
    } catch (error) {
      logger.error({ marketId: i, error }, "Market syncer: failed to sync");
    }
  }

  logger.debug({ count }, "Market syncer: sync complete");
}

/**
 * Start the market syncer cron job.
 * Runs every 2 minutes to keep DB in sync with on-chain state.
 */
export function startMarketSyncer(): void {
  // Run immediately on startup
  syncMarkets().catch((err) =>
    logger.error({ err }, "Market syncer initial sync failed")
  );

  cron.schedule("*/2 * * * *", async () => {
    try {
      await syncMarkets();
    } catch (error) {
      logger.error({ error }, "Market syncer cron error");
    }
  });

  logger.info("Market syncer started (every 2 minutes)");
}
