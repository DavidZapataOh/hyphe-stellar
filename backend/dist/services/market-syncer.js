import cron from "node-cron";
import { prisma } from "../db/client.js";
import { logger } from "../utils/logger.js";
import { getMarket, getMarketCount } from "../stellar/contracts.js";
import { scValToNative } from "@stellar/stellar-sdk";
/**
 * Sync on-chain market state to PostgreSQL.
 * Fetches markets from the factory contract and upserts into DB.
 */
async function syncMarkets() {
    const count = await getMarketCount();
    if (count === 0)
        return;
    for (let i = 1; i <= count; i++) {
        try {
            const raw = await getMarket(i);
            if (!raw)
                continue;
            // Parse the ScVal struct into a native object
            const market = scValToNative(raw);
            const endTime = new Date(Number(market.end_time) * 1000);
            // Map on-chain status enum to DB status
            const statusMap = {
                Open: "OPEN",
                Closed: "CLOSED",
                Resolved: "RESOLVED",
                Disputed: "DISPUTED",
            };
            const status = statusMap[market.status] ?? "OPEN";
            // u32::MAX (4294967295) is the sentinel for "no winner yet"
            const NO_WINNER = 4294967295;
            const winningOutcome = market.winning_outcome === NO_WINNER ? null : market.winning_outcome;
            // NOTE: totalCollateral is NOT synced from the factory because the
            // factory doesn't know about AMM trades. The indexer tracks collateral
            // by incrementing on each trade event. Only sync status & resolution.
            await prisma.market.upsert({
                where: { id: i },
                update: {
                    status,
                    winningOutcome,
                },
                create: {
                    id: i,
                    question: market.question,
                    numOutcomes: market.num_outcomes,
                    endTime,
                    status,
                    winningOutcome,
                    totalCollateral: 0n,
                },
            });
        }
        catch (error) {
            logger.error({ marketId: i, error }, "Market syncer: failed to sync");
        }
    }
    logger.debug({ count }, "Market syncer: sync complete");
}
/**
 * Start the market syncer cron job.
 * Runs every 2 minutes to keep DB in sync with on-chain state.
 */
export function startMarketSyncer() {
    // Run immediately on startup
    syncMarkets().catch((err) => logger.error({ err }, "Market syncer initial sync failed"));
    cron.schedule("*/2 * * * *", async () => {
        try {
            await syncMarkets();
        }
        catch (error) {
            logger.error({ error }, "Market syncer cron error");
        }
    });
    logger.info("Market syncer started (every 2 minutes)");
}
//# sourceMappingURL=market-syncer.js.map