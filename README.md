# Sveltekit Statefull session

## Setup

Create a `src/hooks.server.ts` file in your svelte project using the following code:

```ts 
// src/hooks.server.ts
import { InMemorySessionRepository, handleSession } from '$lib/index.js';

const repository = new InMemorySessionRepository({ ttl: '5s'});
export const handle = handleSession(repository, { debug: true });
```

> If you already have a hooks.server.ts file declared, you can chain handler with the [sequence](https://kit.svelte.dev/docs/types#public-types-requestevent) function.

In your `src/app.d.ts` file, copy the following code, and fill in the Session type

```ts

// See https://kit.svelte.dev/docs/types#app
import type { SveltekitSession } from "$lib/session.server.ts";

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

> The InMemory repository works only with the node adapter and only with a single instance of node.

## handleSession options

| Option            | Description                            | Default                         |
|-------------------|----------------------------------------|---------------------------------|
| sessionCookieName | Name of the session cookie             | 'svelte-session-key'            |
| keyGenerator      | Function to generate a new session key | crypto.randomUUID()             |
| debug             | Log session events                     | false                           |
| secure            | Secure the session cookie              | { dev } from "$app/environment" |

## Examples
You can see a working example [here](/src/routes/+page.server.ts)

## Todo
- [x] Session TTL
- [x] Cookie session id
- [x] Create InMemory repository
- [x] Create Redis repository
- [ ] Create Prisma repository
- [ ] Publish on npm repository with a github action
- [ ] Playwright tests
- [ ] Create mono-repo for every repositories ?