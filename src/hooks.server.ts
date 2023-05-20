import { InMemorySessionRepository, RedisSessionRepository, handleSession } from '$lib/index.js';

//import { createClient } from '@redis/client';
//
//const redis = createClient({
//    url: 'redis://localhost:32768/0'
//});
//redis.connect();
//export const handle = handleSession(new RedisSessionRepository({ ttl: '5s', client: redis }), { debug: true })


// OR
export const handle = handleSession(new InMemorySessionRepository({ ttl: '60s' }), { debug: true })
