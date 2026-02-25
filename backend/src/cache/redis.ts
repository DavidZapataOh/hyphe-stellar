import { Redis } from "ioredis";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;

  try {
    redis = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 10) return null; // stop reconnecting after 10 attempts
        return Math.min(times * 500, 5000);
      },
    });

    redis.on("error", (err: Error) => {
      logger.warn({ err: err.message }, "Redis connection error — running without cache");
    });

    return redis;
  } catch {
    logger.warn("Redis not available — running without cache");
    return null;
  }
}

// Helpers that gracefully handle no-redis
export async function cacheGet(key: string): Promise<string | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    return await r.get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    if (ttlSeconds) {
      await r.set(key, value, "EX", ttlSeconds);
    } else {
      await r.set(key, value);
    }
  } catch {
    // silently ignore
  }
}

export async function cacheHSet(
  key: string,
  fields: Record<string, string>
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.hset(key, fields);
  } catch {
    // silently ignore
  }
}

export async function cacheHGetAll(
  key: string
): Promise<Record<string, string> | null> {
  const r = getRedis();
  if (!r) return null;
  try {
    const result = await r.hgetall(key);
    return Object.keys(result).length > 0 ? result : null;
  } catch {
    return null;
  }
}

export async function cachePublish(
  channel: string,
  message: string
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.publish(channel, message);
  } catch {
    // silently ignore
  }
}
