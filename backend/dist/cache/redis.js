import { Redis } from "ioredis";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
let redis = null;
export function getRedis() {
    if (redis)
        return redis;
    try {
        redis = new Redis(config.REDIS_URL, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                if (times > 10)
                    return null; // stop reconnecting after 10 attempts
                return Math.min(times * 500, 5000);
            },
        });
        redis.on("error", (err) => {
            logger.warn({ err: err.message }, "Redis connection error — running without cache");
        });
        return redis;
    }
    catch {
        logger.warn("Redis not available — running without cache");
        return null;
    }
}
// Helpers that gracefully handle no-redis
export async function cacheGet(key) {
    const r = getRedis();
    if (!r)
        return null;
    try {
        return await r.get(key);
    }
    catch {
        return null;
    }
}
export async function cacheSet(key, value, ttlSeconds) {
    const r = getRedis();
    if (!r)
        return;
    try {
        if (ttlSeconds) {
            await r.set(key, value, "EX", ttlSeconds);
        }
        else {
            await r.set(key, value);
        }
    }
    catch {
        // silently ignore
    }
}
export async function cacheHSet(key, fields) {
    const r = getRedis();
    if (!r)
        return;
    try {
        await r.hset(key, fields);
    }
    catch {
        // silently ignore
    }
}
export async function cacheHGetAll(key) {
    const r = getRedis();
    if (!r)
        return null;
    try {
        const result = await r.hgetall(key);
        return Object.keys(result).length > 0 ? result : null;
    }
    catch {
        return null;
    }
}
export async function cachePublish(channel, message) {
    const r = getRedis();
    if (!r)
        return;
    try {
        await r.publish(channel, message);
    }
    catch {
        // silently ignore
    }
}
//# sourceMappingURL=redis.js.map