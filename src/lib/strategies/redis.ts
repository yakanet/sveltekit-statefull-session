import { TTLParser } from "$lib/ttl.js";
import type { RedisClientType } from "@redis/client";
import type { RepositoryOption, SessionRepository } from "./strategy.js";

interface RedisOption {
    client: RedisClientType;
}

export class RedisSessionRepository<Session> implements SessionRepository<Session> {
    #redisClient: RedisClientType;

    #ttl: TTLParser;

    constructor(options: RepositoryOption & RedisOption) {
        this.#ttl = new TTLParser(options.ttl);
        this.#redisClient = options.client;
    }

    async exists(sessionKey: string): Promise<boolean> {
        const value = await this.#redisClient.get(sessionKey);
        return value !== null;
    }

    async initializeSession(sessionKey: string): Promise<void> {
        await this.#redisClient.set(sessionKey, JSON.stringify('null'));
        await this.#redisClient.expire(sessionKey, this.#ttl.toSecond());
    }

    async loadValue(sessionKey: string): Promise<Session | null> {
        const value = await this.#redisClient.get(sessionKey);
        if (!value) {
            return null;
        }
        return JSON.parse(value);
    }

    async storeValue(sessionKey: string, value: Session): Promise<void> {
        await this.#redisClient.set(sessionKey, JSON.stringify(value));
        await this.#redisClient.expire(sessionKey, this.#ttl.toSecond());
    }

    async destroySession(sessionKey: string): Promise<void> {
        await this.#redisClient.del(sessionKey);
    }

    async purgeExpired(): Promise<void> {
    }

    ttl(): TTLParser {
        return this.#ttl;
    }
}