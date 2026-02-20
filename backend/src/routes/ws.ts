import { FastifyInstance } from "fastify";
import { Redis } from "ioredis";
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
    const mainRedis = getRedis();

    if (!mainRedis) {
      socket.send(
        JSON.stringify({ error: "Redis not available for real-time updates" })
      );
      socket.close();
      return;
    }

    // Create a dedicated subscriber connection
    const subscriber = new Redis(mainRedis.options);

    subscriber.subscribe(channel).then(() => {
      logger.debug({ channel }, "WS: client subscribed");
    }).catch((err: unknown) => {
      logger.error({ err, channel }, "WS: Redis subscribe failed");
      socket.close();
    });

    subscriber.on("message", (_ch: string, message: string) => {
      socket.send(message);
    });

    socket.on("close", () => {
      subscriber.unsubscribe(channel);
      subscriber.disconnect();
      logger.debug({ channel }, "WS: client disconnected");
    });

    socket.on("error", (err: Error) => {
      logger.error({ err, channel }, "WS: socket error");
      subscriber.unsubscribe(channel);
      subscriber.disconnect();
    });
  });
}
