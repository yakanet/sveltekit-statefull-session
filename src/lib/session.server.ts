import { dev } from "$app/environment";
import type { Handle, RequestEvent } from "@sveltejs/kit";
import type { SessionKey, SessionRepository } from "./strategies/strategy.js";

export type SessionOption = {
    sessionCookieName: string;
    keyGenerator: () => string;
    debug: boolean;
    secure: boolean;
}

/**
 * 
 * @param repository 
 * @param options 
 * @returns 
 */
export function handleSession(repository: SessionRepository<Session>, options: Partial<SessionOption> = {}): Handle {
    return async function ({ event, resolve }) {
        event.locals.session = new SveltekitSession(event, repository, options);
        return resolve(event);
    }
}

function defaultSessionKey(): SessionKey {
    return crypto.randomUUID();
}

export class SveltekitSession<Session> {
    private options: SessionOption;
    private sessionKey: SessionKey | null;

    constructor(private event: RequestEvent, private repository: SessionRepository<Session>, options: Partial<SessionOption> = {}) {
        this.options = {
            keyGenerator: options.keyGenerator ?? defaultSessionKey,
            sessionCookieName: options.sessionCookieName ?? 'svelte-session-key',
            debug: options.debug ?? false,
            secure: options.secure ?? dev,
        }
        this.repository.purgeExpired();
        this.sessionKey = event.cookies.get(this.options.sessionCookieName) ?? null;
        if (this.sessionKey && !this.repository.exists(this.sessionKey)) {
            this.event.cookies.delete(this.options.sessionCookieName, {
                path: '/',
                httpOnly: true,
                maxAge: this.repository.ttl().toSecond(),
                secure: this.options.secure,
            });
            this.sessionKey = null;
        }
    }

    private log(message?: any, ...params: any[]) {
        if (this.options.debug) {
            console.log(message, params);
        }
    }

    async create(): Promise<boolean> {
        if (this.sessionKey) {
            return false;
        }
        this.sessionKey = this.options.keyGenerator();
        this.log(`Creating new session ${this.sessionKey}`);
        this.event.cookies.set(this.options.sessionCookieName, this.sessionKey, {
            path: '/',
            httpOnly: true,
            maxAge: this.repository.ttl().toSecond(),
            secure: this.options.secure,
        });
        await this.repository.initializeSession(this.sessionKey);
        return true
    }

    async exists(): Promise<boolean> {
        if (!this.sessionKey) {
            return false;
        }
        return this.repository.exists(this.sessionKey);
    }

    async get(initializeIfNull = false): Promise<Session | null> {
        if (!this.sessionKey) {
            if (initializeIfNull) {
                this.create();
            }
            return null;
        }
        return this.repository.loadValue(this.sessionKey);
    }

    async update(value: Session): Promise<boolean> {
        if (!this.sessionKey) {
            return false;
        }
        this.event.cookies.set(this.options.sessionCookieName, this.sessionKey, {
            path: '/',
            httpOnly: true,
            maxAge: this.repository.ttl().toSecond(),
            secure: this.options.secure,
        });
        await this.repository.storeValue(this.sessionKey, value);
        this.log(`Updating session ${this.sessionKey}`, value);
        return true;
    }

    async destroy(): Promise<boolean> {
        if (!this.sessionKey) {
            return false;
        }
        this.event.cookies.delete(this.options.sessionCookieName, {
            path: '/',
            httpOnly: true,
            maxAge: this.repository.ttl().toSecond(),
            secure: this.options.secure,
        });
        await this.repository.destroySession(this.sessionKey);
        this.log(`Destroying session ${this.sessionKey}`);
        return true;
    }
}
