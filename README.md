# Sveltekit Statefull session

## Setup

Create a `src/hooks.server.ts` file in your svelte project using the following code:

```ts 
// src/hooks.server.ts
import { InMemorySessionRepository, handleSession } from '@sveltekit-statefull-session/core';

const repository = new InMemorySessionRepository({ ttl: '5s'});
export const handle = handleSession(repository, { debug: true });
```

> If you already have a hooks.server.ts file declared, you can chain handler with the [sequence](https://kit.svelte.dev/docs/types#public-types-requestevent) function.

In your `src/app.d.ts` file, copy the following code, and fill in the Session type

```ts

// See https://kit.svelte.dev/docs/types#app
import type { SveltekitSession } from "@sveltekit-statefull-session/core";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: SveltekitSession<Session>;
		}
		// interface PageData {}
		// interface Platform {}
	}

	type Session = {
		// TODO: Whatever you want in your session
	}
}

export { };
```

You can access only from the server side to the session using the `locals.session` available from the [RequestEvent](https://kit.svelte.dev/docs/types#public-types-requestevent) property in any load function (or action function).

## handleSession 

`handleSession` takes 2 paramèters :
- repository: Must be any instance of the `SessionRepository` interface
- options: (optional) to fine tune the session

### Options

| Option            | Description                            | Default                         |
|-------------------|----------------------------------------|---------------------------------|
| sessionCookieName | Name of the session cookie             | 'svelte-session-key'            |
| keyGenerator      | Function to generate a new session key | crypto.randomUUID()             |
| debug             | Log session events                     | false                           |
| secure            | Secure the session cookie              | true                            |


## InMemorySessionRepository
Create an instance of InMemorySessionRepository using the 2 followings parameters : 
- `ttl`: A simple string describing how long should the session last. More information [here](#ttl)

> InMemorySessionRepository works only with the node adapter and only with a single instance of node.

## RedisSessionRepository
You need to install [@redis/client](https://www.npmjs.com/package/redis), and create an instance in your `src/hooks.server.ts` using the `createClient` function.

You need to install [@sveltekit-statefull-session/repository-redis](https://www.npmjs.com/package/@sveltekit-statefull-session/repository-redis) and create an instance of RedisSessionRepository.

Create an instance of RedisSessionRepository using the 2 followings parameters : 
- `ttl`: A simple string describing how long should the session last. More information [here](#ttl)
- `client`: The previously created instance of redis client

## TTL
A ttl is a string declaring how long the session should last. The string must follow the following format `${number}${unit}` :
- number is the quantity of time 
- unit is the unit of time (currently only `s`: second, `m`: minute, `h`: hour are supported)

For instance : 
```ts
const ttl1: TTL = '5m'  // 5 minutes
const ttl2: TTL = '2h'  // 2 hours
const ttl3: TTL = '36s' // 36 seconds
```

## Examples
You can see a working example here: [simple-session](examples/simple-session/)

## Compile project

```sh
pnpm i
pnpm build
pnpm example
```

## Todo
- [x] Session TTL
- [x] Cookie session id
- [x] Create InMemory repository
- [x] Create Redis repository
- [ ] Create Prisma repository
- [ ] Option for handleSession to refresh the TTL on update or not
- [x] Publish on npm repository with a github action
- [ ] Playwright tests
- [x] Create mono-repo for every repositories
