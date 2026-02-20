import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { marketRoutes } from "./routes/markets.js";
import { vaultRoutes } from "./routes/vault.js";
import { infofiRoutes } from "./routes/infofi.js";
import { wsRoutes } from "./routes/ws.js";
import { startOracleIngester } from "./services/oracle-ingester.js";
import { startIndexer } from "./services/indexer.js";
import { startPriceTracker } from "./services/price-tracker.js";
import { startYieldCron } from "./services/yield-cron.js";
import { startInfoFiEngine } from "./services/infofi-engine.js";
import { startMarketSyncer } from "./services/market-syncer.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";

async function main() {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino/file",
        options: { destination: 1 },
      },
      level: process.env["LOG_LEVEL"] || "info",
    },
  });

  // ── Plugins ────────────────────────────
  await app.register(cors, { origin: "*" });
  await app.register(websocket);

  // ── Routes ─────────────────────────────
  await app.register(marketRoutes);
  await app.register(vaultRoutes);
  await app.register(infofiRoutes);
  await app.register(wsRoutes);

  // ── Health check ───────────────────────
  app.get("/health", async () => ({ status: "ok", timestamp: Date.now() }));

  // ── Background services ────────────────
  startOracleIngester();
  startPriceTracker();
  startYieldCron();
  startInfoFiEngine();
  startMarketSyncer();

  // Indexer needs async init (reads last ledger from Redis)
  startIndexer().catch((err) =>
    logger.error({ err }, "Failed to start indexer")
  );

  // ── Start server ───────────────────────
  await app.listen({ port: config.PORT, host: "0.0.0.0" });
  logger.info(`Hyphe backend running on port ${config.PORT}`);
}

main().catch((err) => {
  logger.error({ err }, "Fatal: server failed to start");
  process.exit(1);
});
