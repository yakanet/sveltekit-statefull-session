import type { Actions } from "@sveltejs/kit";

export async function load({ locals }) {
    return {
        created: locals.session.exists(),
        session: locals.session.get()
    }
};

export const actions = {
    create: async ({ locals }) => {
        return {
            success: await locals.session.create()
        };
    },
    refresh: async ({ locals }) => {
        return {
            success: !!await locals.session.get()
        };
    },
    store: async ({ locals }) => {
        return {
            success: await locals.session.update({ 
                lastUpdated: String(new Date()),
                uuid: crypto.randomUUID()
            })
        };
    },
    destroy: async ({ locals }) => {
        return {
            success: await locals.session.destroy()
        };
    }

} satisfies Actions;