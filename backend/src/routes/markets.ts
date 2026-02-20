import { FastifyInstance } from "fastify";
import { prisma } from "../db/client.js";
import { cacheHGetAll } from "../cache/redis.js";
import { quoteBuy, getOutcomeBalance, getOutcomeTotalSupply } from "../stellar/contracts.js";

export async function marketRoutes(app: FastifyInstance): Promise<void> {
  // GET /api/markets — list all markets with current prices
  app.get("/api/markets", async (request) => {
    const { status, sport, sort } = request.query as {
      status?: string;
      sport?: string;
      sort?: string;
    };

    const markets = await prisma.market.findMany({
      where: {
        ...(status && status !== "all"
          ? { status: status.toUpperCase() as "OPEN" | "CLOSED" | "RESOLVED" | "DISPUTED" }
          : {}),
        ...(sport ? { sportType: sport } : {}),
      },
      orderBy:
        sort === "volume"
          ? { totalCollateral: "desc" }
          : sort === "ending"
            ? { endTime: "asc" }
            : { id: "desc" },
    });

    // Enrich with cached prices
    const enriched = await Promise.all(
      markets.map(async (m) => {
        const prices = await cacheHGetAll(`market:${m.id}:prices`);
        return {
          ...m,
          totalCollateral: m.totalCollateral.toString(),
          yesPrice: parseFloat(prices?.yes || "0.5"),
          noPrice: parseFloat(prices?.no || "0.5"),
        };
      })
    );

    return enriched;
  });

  // GET /api/markets/:id — single market detail
  app.get("/api/markets/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const market = await prisma.market.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!market) {
      return reply.status(404).send({ error: "Market not found" });
    }

    const prices = await cacheHGetAll(`market:${market.id}:prices`);

    return {
      ...market,
      totalCollateral: market.totalCollateral.toString(),
      yesPrice: parseFloat(prices?.yes || "0.5"),
      noPrice: parseFloat(prices?.no || "0.5"),
    };
  });

  // GET /api/markets/:id/history — price history for charts
  app.get("/api/markets/:id/history", async (request) => {
    const { id } = request.params as { id: string };
    const { from, to } = request.query as { from?: string; to?: string };

    const snapshots = await prisma.priceSnapshot.findMany({
      where: {
        marketId: parseInt(id, 10),
        ...(from ? { timestamp: { gte: new Date(from) } } : {}),
        ...(to ? { timestamp: { lte: new Date(to) } } : {}),
      },
      orderBy: { timestamp: "asc" },
    });

    return snapshots;
  });

  // GET /api/markets/:id/trades — trade history
  app.get("/api/markets/:id/trades", async (request) => {
    const { id } = request.params as { id: string };
    const { limit } = request.query as { limit?: string };

    const trades = await prisma.trade.findMany({
      where: { marketId: parseInt(id, 10) },
      orderBy: { timestamp: "desc" },
      take: parseInt(limit || "50", 10),
    });

    return trades.map((t) => ({
      ...t,
      shares: t.shares.toString(),
      cost: t.cost.toString(),
    }));
  });

  // GET /api/markets/:id/quote — get cost to buy N shares
  app.get("/api/markets/:id/quote", async (request) => {
    const { id } = request.params as { id: string };
    const { outcome, shares } = request.query as {
      outcome?: string;
      shares?: string;
    };

    const cost = await quoteBuy(
      parseInt(id, 10),
      parseInt(outcome || "0", 10),
      BigInt(shares || "1000000")
    );

    return { cost: cost.toString() };
  });

  // GET /api/markets/:id/positions/:address — user positions in a market
  app.get("/api/markets/:id/positions/:address", async (request) => {
    const { id, address } = request.params as { id: string; address: string };
    const marketId = parseInt(id, 10);

    const market = await prisma.market.findUnique({
      where: { id: marketId },
    });
    if (!market) {
      return { outcomes: [] };
    }

    const outcomes = [];
    for (let o = 0; o < market.numOutcomes; o++) {
      const balance = await getOutcomeBalance(marketId, o, address);
      const supply = await getOutcomeTotalSupply(marketId, o);
      outcomes.push({
        outcome: o,
        balance: balance.toString(),
        totalSupply: supply.toString(),
      });
    }

    return { outcomes };
  });
}
