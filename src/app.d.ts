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
		lastUpdated: string;
		uuid: string;
	}
}

export { };
