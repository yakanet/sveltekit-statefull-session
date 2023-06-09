import { handleSession } from '@sveltekit-statefull-session/core';
import { RedisSessionRepository } from '@sveltekit-statefull-session/repository-redis';
import { REDIS_URL, REDIS_URL_TLS } from '$env/static/private';

import { createClient } from '@redis/client';

const redis = createClient({
    url: REDIS_URL,
    socket: {
        tls: REDIS_URL_TLS === "true"
    }
});
await redis.connect();
export const handle = handleSession(new RedisSessionRepository({ ttl: '60s', client: redis }), { debug: true })

// OR
// export const handle = handleSession(new InMemorySessionRepository({ ttl: '60s' }), { debug: true })
