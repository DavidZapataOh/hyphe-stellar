import { FastifyInstance } from "fastify";
import { Redis } from "ioredis";
import { config } from "../config/index.js";
import { getRedis } from "../cache/redis.js";
import { logger } from "../utils/logger.js";

export async function wsRoutes(app: FastifyInstance): Promise<void> {
  // WS /ws/odds?market=<id> — real-time odds stream
  app.get("/ws/odds", { websocket: true }, (socket, request) => {
    const { market } = request.query as { market?: string };

    if (!market) {
      socket.send(JSON.stringify({ error: "market query param required" }));
      socket.close();
      return;
    }

    const channel = `odds:${market}`;

    if (!getRedis()) {
      socket.send(
        JSON.stringify({ error: "Redis not available for real-time updates" })
      );
      socket.close();
      return;
    }

    // Dedicated subscriber — pub/sub blocks the connection so it needs its own.
    // Use config.REDIS_URL directly (NOT mainRedis.options) to get clean defaults:
    // lazyConnect: false (connects immediately), enableOfflineQueue: true (queues subscribe until connected).
    const subscriber = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 500, 3000);
      },
    });

    subscriber.on("error", (err: Error) => {
      logger.warn({ err: err.message, channel }, "WS subscriber Redis error");
    });

    subscriber
      .subscribe(channel)
      .then(() => {
        logger.debug({ channel }, "WS: client subscribed");
      })
      .catch((err: unknown) => {
        logger.error({ err, channel }, "WS: Redis subscribe failed");
        socket.send(
          JSON.stringify({ error: "Failed to subscribe to updates" })
        );
        socket.close();
      });

    subscriber.on("message", (_ch: string, message: string) => {
      try {
        socket.send(message);
      } catch {
        // socket may already be closed
      }
    });

    const cleanup = () => {
      try {
        subscriber.unsubscribe(channel).catch(() => {});
      } catch {
        // ignore
      }
      try {
        subscriber.disconnect();
      } catch {
        // ignore
      }
    };

    socket.on("close", () => {
      cleanup();
      logger.debug({ channel }, "WS: client disconnected");
    });

    socket.on("error", (err: Error) => {
      logger.error({ err, channel }, "WS: socket error");
      cleanup();
    });
  });
}
