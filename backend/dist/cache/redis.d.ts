import { Redis } from "ioredis";
export declare function getRedis(): Redis | null;
export declare function cacheGet(key: string): Promise<string | null>;
export declare function cacheSet(key: string, value: string, ttlSeconds?: number): Promise<void>;
export declare function cacheHSet(key: string, fields: Record<string, string>): Promise<void>;
export declare function cacheHGetAll(key: string): Promise<Record<string, string> | null>;
export declare function cachePublish(channel: string, message: string): Promise<void>;
