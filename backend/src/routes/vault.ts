import { FastifyInstance } from "fastify";
import { prisma } from "../db/client.js";
import {
  getUserYield,
  getUserDeposit,
  getVaultTvl,
  getBlendPosition,
  getVaultTotalYield,
} from "../stellar/contracts.js";

export async function vaultRoutes(app: FastifyInstance): Promise<void> {
  // GET /api/vault/stats — global vault statistics
  app.get("/api/vault/stats", async () => {
    const latest = await prisma.vaultSnapshot.findFirst({
      orderBy: { timestamp: "desc" },
    });

    // Also read live on-chain data
    let liveTvl = latest?.tvl ?? 0n;
    let liveYield = latest?.yieldCumulative ?? 0n;

    try {
      liveTvl = await getVaultTvl();
      liveYield = await getVaultTotalYield();
    } catch {
      // Fall back to DB snapshot if on-chain read fails
    }

    return {
      tvl: liveTvl.toString(),
      blendBalance: (latest?.blendBalance ?? 0n).toString(),
      bufferBalance: (latest?.bufferBalance ?? 0n).toString(),
      yieldCumulative: liveYield.toString(),
      apyEstimate: latest?.apyEstimate ?? 0,
      lastUpdated: latest?.timestamp ?? null,
    };
  });

  // GET /api/vault/history — vault TVL/yield over time
  app.get("/api/vault/history", async (request) => {
    const { limit } = request.query as { limit?: string };

    const snapshots = await prisma.vaultSnapshot.findMany({
      orderBy: { timestamp: "desc" },
      take: parseInt(limit || "100", 10),
    });

    return snapshots.map((s) => ({
      tvl: s.tvl.toString(),
      blendBalance: s.blendBalance.toString(),
      bufferBalance: s.bufferBalance.toString(),
      yieldGenerated: s.yieldGenerated.toString(),
      yieldCumulative: s.yieldCumulative.toString(),
      apyEstimate: s.apyEstimate,
      timestamp: s.timestamp,
    }));
  });

  // GET /api/vault/user/:address — user's vault position (read from chain)
  app.get("/api/vault/user/:address", async (request) => {
    const { address } = request.params as { address: string };

    const [deposit, pendingYield] = await Promise.all([
      getUserDeposit(address),
      getUserYield(address),
    ]);

    return {
      deposit: deposit.toString(),
      pendingYield: pendingYield.toString(),
    };
  });
}
