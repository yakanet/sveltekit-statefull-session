<script>
    import { enhance } from "$app/forms";
    export let data;
</script>

<main>
    <pre>{JSON.stringify(data, null, 2)}</pre>
    <form method="post" use:enhance>
        {#if !data.created}
            <button type="submit" formaction="?/create">
                Create session
            </button>
        {:else}
            <button type="submit" formaction="?/store">
                Store in session
            </button>
            <button type="submit" formaction="?/refresh">
                Refresh session
            </button>
            <button type="submit" formaction="?/destroy">
                Destroy session
            </button>
        {/if}
    </form>
</main>
