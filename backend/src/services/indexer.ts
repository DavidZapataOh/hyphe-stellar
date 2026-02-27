import { rpc } from "@stellar/stellar-sdk";
import { prisma } from "../db/client.js";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { getSorobanServer } from "../stellar/client.js";
import { parseEvent } from "../stellar/events.js";
import { cacheGet, cacheSet, cacheHSet, cachePublish } from "../cache/redis.js";
import { getPrices } from "../stellar/contracts.js";

let lastLedger = 0;
const POLL_INTERVAL_MS = 5000; // ~1 ledger close

/**
 * Process a single Soroban contract event.
 */
async function processEvent(
  event: rpc.Api.EventResponse
): Promise<void> {
  const parsed = parseEvent(event);

  switch (parsed.type) {
    case "trade": {
      const d = parsed.data;

      await prisma.trade.create({
        data: {
          marketId: d.marketId,
          user: d.user,
          outcome: d.outcome,
          side: d.side,
          shares: d.shares.toString(),
          cost: d.cost,
          price: Number(d.cost) / Math.max(Number(d.shares), 1),
          txHash: event.id,
        },
      });

      // Update collateral tracking
      await prisma.market.update({
        where: { id: d.marketId },
        data: {
          totalCollateral: {
            increment: d.side === "BUY" ? d.cost : -d.cost,
          },
        },
      });

      // Refresh on-chain prices and push to cache + websocket
      const prices = await getPrices(d.marketId);
      if (prices.length >= 2) {
        const yesPrice = Number(prices[0]) / 1e18;
        const noPrice = Number(prices[1]) / 1e18;

        await cacheHSet(`market:${d.marketId}:prices`, {
          yes: yesPrice.toString(),
          no: noPrice.toString(),
        });

        await cachePublish(
          `odds:${d.marketId}`,
          JSON.stringify({ yes: yesPrice, no: noPrice, timestamp: Date.now() })
        );
      }

      logger.info(
        { marketId: d.marketId, side: d.side, user: d.user },
        "Indexed trade"
      );
      break;
    }

    case "market_created": {
      const d = parsed.data;

      // Upsert market (may already exist from syncer)
      await prisma.market.upsert({
        where: { id: d.marketId },
        update: {},
        create: {
          id: d.marketId,
          question: d.question,
          numOutcomes: d.numOutcomes,
          endTime: new Date(d.endTime * 1000),
          status: "OPEN",
        },
      });

      logger.info({ marketId: d.marketId }, "Indexed market creation");
      break;
    }

    case "resolved": {
      const d = parsed.data;

      await prisma.market.update({
        where: { id: d.marketId },
        data: {
          status: "RESOLVED",
          winningOutcome: d.winningOutcome,
          resolvedAt: new Date(),
        },
      });

      logger.info(
        { marketId: d.marketId, outcome: d.winningOutcome },
        "Indexed market resolution"
      );
      break;
    }

    case "deposit":
    case "withdraw":
      logger.debug({ type: parsed.type, data: parsed.data }, "Vault event");
      break;

    default:
      break;
  }
}

/**
 * Fetch and process new events since lastLedger.
 */
async function processNewEvents(): Promise<void> {
  const server = getSorobanServer();
  const latestLedger = await server.getLatestLedger();

  if (latestLedger.sequence <= lastLedger) return;

  const contractIds = [
    config.FACTORY_CONTRACT,
    config.AMM_CONTRACT,
    config.VAULT_CONTRACT,
  ].filter(Boolean);

  if (contractIds.length === 0) {
    logger.warn("No contract IDs configured — indexer has nothing to watch");
    return;
  }

  try {
    const events = await server.getEvents({
      startLedger: lastLedger + 1,
      filters: [
        {
          type: "contract",
          contractIds,
        },
      ],
    });

    for (const event of events.events) {
      try {
        await processEvent(event);
      } catch (err) {
        logger.error({ err, eventId: event.id }, "Error processing event");
      }
    }
  } catch (err) {
    // getEvents may fail if ledger range is too old — just advance
    logger.warn({ err }, "getEvents failed — advancing ledger cursor");
  }

  lastLedger = latestLedger.sequence;
  await cacheSet("indexer:last_ledger", lastLedger.toString());
}

/**
 * Start the indexer polling loop.
 */
export async function startIndexer(): Promise<void> {
  // Restore cursor from cache
  const stored = await cacheGet("indexer:last_ledger");
  if (stored) {
    lastLedger = parseInt(stored, 10);
  } else {
    // Start from the latest ledger (don't try to replay history)
    const server = getSorobanServer();
    const latest = await server.getLatestLedger();
    lastLedger = latest.sequence;
  }

  setInterval(async () => {
    try {
      await processNewEvents();
    } catch (error) {
      logger.error({ error }, "Indexer polling error");
    }
  }, POLL_INTERVAL_MS);

  logger.info({ startLedger: lastLedger }, "Indexer started (5s polling)");
}
