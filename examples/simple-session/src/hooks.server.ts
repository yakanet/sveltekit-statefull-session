import { InMemorySessionRepository, handleSession } from '@sveltekit-statefull-session/core';
import { RedisSessionRepository } from '@sveltekit-statefull-session/repository-redis';

import { createClient } from '@redis/client';

// const redis = createClient({
//     url: 'redis://localhost:32768/0'
// });
// redis.connect();
// export const handle = handleSession(new RedisSessionRepository({ ttl: '60s', client: redis }), { debug: true })

console.log(RedisSessionRepository);

// OR
export const handle = handleSession(new InMemorySessionRepository({ ttl: '60s' }), { debug: true })
