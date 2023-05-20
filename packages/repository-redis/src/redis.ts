import { SessionKey, TTLParser } from "@sveltekit-statefull-session/core";
import type { RedisClientType } from "@redis/client";
import type { RepositoryOption, SessionRepository } from "@sveltekit-statefull-session/core";

interface RedisOption {
    client: RedisClientType;
}

export class RedisSessionRepository<Session> implements SessionRepository<Session> {
    private redisPrefix = 'session-key';

    #redisClient: RedisClientType;

    #ttl: TTLParser;

    constructor(options: RepositoryOption & RedisOption) {
        this.#ttl = new TTLParser(options.ttl);
        this.#redisClient = options.client;
    }

    private getRedisKey(sessionKey: SessionKey) {
        return `${this.redisPrefix}:${sessionKey}`;
    }

    async exists(sessionKey: SessionKey): Promise<boolean> {
        const value = await this.#redisClient.get(this.getRedisKey(sessionKey));
        return value !== null;
    }

    async initializeSession(sessionKey: SessionKey): Promise<void> {
        await this.#redisClient.set(this.getRedisKey(sessionKey), JSON.stringify('null'));
        await this.#redisClient.expire(this.getRedisKey(sessionKey), this.#ttl.toSecond());
    }

    async loadValue(sessionKey: SessionKey): Promise<Session | null> {
        const value = await this.#redisClient.get(this.getRedisKey(sessionKey));
        if (!value) {
            return null;
        }
        return JSON.parse(value);
    }

    async storeValue(sessionKey: SessionKey, value: Session): Promise<void> {
        await this.#redisClient.set(this.getRedisKey(sessionKey), JSON.stringify(value));
        await this.#redisClient.expire(this.getRedisKey(sessionKey), this.#ttl.toSecond());
    }

    async destroySession(sessionKey: SessionKey): Promise<void> {
        await this.#redisClient.del(this.getRedisKey(sessionKey));
    }

    async purgeExpired(): Promise<void> {
    }

    ttl(): TTLParser {
        return this.#ttl;
    }
}