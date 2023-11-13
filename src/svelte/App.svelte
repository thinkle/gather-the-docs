<script lang="ts">
  import Content from "./Content.svelte";
  import { Sidebar } from "google-apps-script-svelte-components";
  import { parseContext } from "./lib/parseContext";
  let contextString = `<?= context ?>`;
  let context = parseContext(contextString);
  const isDialog = context.container == "dialog";
</script>

{#if isDialog}
  <div class="window">
    <Content {context} />
  </div>
{:else}
  <Sidebar>
    <Content {context} />
  </Sidebar>
{/if}

<style>
</style>
