import type { TTL, TTLParser } from "../ttl.js";
export type SessionKey = string;

export interface RepositoryOption {
    ttl: TTL
}

export interface SessionRepository<Session> {

    name: string;
    /**
     * @returns configured expiration date
     */
    ttl(): TTLParser;

    /**
     * Is the session exists in the repository
     * @param sessionKey uniq key for the session
     */
    exists(sessionKey: SessionKey): Promise<boolean>;

    /**
     * Initialize a new session 
     * @param sessionKey uniq key for the session
     */
    initializeSession(sessionKey: SessionKey): Promise<void>;

    /**
     * Retrieve the session based on the sessionKey
     * @param sessionKey uniq key for the session
     * @returns {Session} if exists, null otherwise
     */
    loadValue(sessionKey: SessionKey): Promise<Session | null>;

    /**
     * Store the session based on the sessionKey
     * @param sessionKey uniq key for the session
     * @param value current session value
     */
    storeValue(sessionKey: SessionKey, value: Session): Promise<void>;

    /**
     * Remove a session from the repository
     * @param sessionKey uniq key for the session
     */
    destroySession(sessionKey: SessionKey): Promise<void>;

    /**
     * Purge every session from the repository where the TTL has expired
     */
    purgeExpired(): Promise<void>;

}