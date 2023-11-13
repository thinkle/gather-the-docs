<script lang="ts">
  import { copy_all } from "google-apps-script-svelte-components/dist/icons/copy_all";
  import { Block, Icon } from "google-apps-script-svelte-components";
  import type { AddOnContext } from "./lib/parseContext";
  import Picker from "./lib/Picker.svelte";
  export let context: AddOnContext;
  onMount(async () => {
    email = await GoogleAppsScript.getActiveUserEmail();
    environment = await GoogleAppsScript.getAddOnEnvironment();
  });
  let email: string;
  let environment: "Slides" | "Docs" | "Sheets" | "Unknown" = context.addOn;
  console.log("Loading App with context: ", context);

  import { GoogleAppsScript } from "./clientApi";
  import { onMount } from "svelte";
  import Slides from "./Slides.svelte";

  google.script.run
    .withSuccessHandler((v) => (environment = v))
    .getAddOnEnvironment();
</script>

<h1><Icon icon={copy_all.outlined} /> Gather the Docs!</h1>
{#if !environment}
  {#if email}
    <Block>
      Why, hello there, {email}
    </Block>
  {/if}
{:else if context.params && context.params[0] === "picker"}
  <Picker />
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
