import { TTLParser } from "$lib/ttl.js";
import type { SessionRepository, SessionKey, RepositoryOption } from "./strategy.js";

interface SessionHolder<Session> {
    expiration: number;
    data: Session;
}

export class InMemorySessionRepository<Session> implements SessionRepository<Session> {
    private static sessions = new Map<SessionKey, SessionHolder<any>>();
    #ttl: TTLParser;
    #options: RepositoryOption;

    constructor(options: RepositoryOption) {
        this.#ttl = new TTLParser(options.ttl);
        this.#options = options;
    }

    options(): RepositoryOption {
        return this.#options;
    }

    ttl(): TTLParser {
        return this.#ttl;
    }

    async exists(sessionKey: string): Promise<boolean> {
        return InMemorySessionRepository.sessions.has(sessionKey);
    }

    async initializeSession(sessionKey: string): Promise<void> {
        InMemorySessionRepository.sessions.set(sessionKey, {
            expiration: Date.now() + this.#ttl.toMilliSecond(),
            data: null
        });
    }

    async loadValue(sessionKey: string): Promise<Session | null> {
        return InMemorySessionRepository.sessions.get(sessionKey)?.data ?? null;
    }

    async storeValue(sessionKey: string, value: Session): Promise<void> {
        const session = InMemorySessionRepository.sessions.get(sessionKey);
        if (session) {
            InMemorySessionRepository.sessions.set(sessionKey, {
                ...session,
                data: value
            });
        }
    }

    async destroySession(sessionKey: string): Promise<void> {
        InMemorySessionRepository.sessions.delete(sessionKey);
    }

    async purgeExpired(): Promise<void> {
        InMemorySessionRepository.sessions.forEach((_, sessionKey) => {
            const expiration = InMemorySessionRepository.sessions.get(sessionKey)!.expiration;
            if (!expiration || Date.now() > expiration) {
                this.destroySession(sessionKey);
            }
        });
    }
}
