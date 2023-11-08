<script lang="ts">
  import Counter from "./lib/Counter.svelte";
  import { copy_all } from "google-apps-script-svelte-components/dist/lib/icons/copy_all";
  import { Block, Icon } from "google-apps-script-svelte-components";
  import type { AddOnContext } from "./lib/parseContext";

  export let context: AddOnContext;
  onMount(async () => {
    email = await GoogleAppsScript.getActiveUserEmail();
    environment = await GoogleAppsScript.getAddOnEnvironment();
  });
  let email: string;
  let environment: "Slides" | "Docs" | "Sheets" | "Unknown" = context.addOn;

  import { GoogleAppsScript } from "./clientApi";
  import { onMount } from "svelte";
  import Slides from "./Slides.svelte";

  google.script.run
    .withSuccessHandler((v) => (environment = v))
    .getAddOnEnvironment();
</script>

<h1><Icon icon={copy_all.outlined} /> Gather the Docs!</h1>
{#if !environment}
  <Block>
    <Counter />
  </Block>

  {#if email}
    <Block>
      Why, hello there, {email}
    </Block>
  {/if}
{:else if environment === "Slides"}
  <Slides />
{:else}
  <h2>We are in {environment}</h2>

  <Block>
    <a href="https://learn.svelte.dev/tutorial/welcome-to-svelte">
      Learn Svelte
    </a>
  </Block>
{/if}

<style>
  :global(h1) {
    color: purple;
  }
</style>
