<script lang="ts">
  import Counter from "./lib/Counter.svelte";
  import Block from "./lib/Block.svelte";
  import Sidebar from "./lib/Sidebar.svelte";
  onMount(async () => {
    email = await GoogleAppsScript.getActiveUserEmail();
    environment = await GoogleAppsScript.getAddOnEnvironment();
  });
  let email: string;
  let environment: "Slides" | "Docs" | "Sheets" | "Unknown";

  import { GoogleAppsScript } from "./clientApi";
  import { onMount } from "svelte";
  import Slides from "./Slides.svelte";
  //google.script.run.withSuccessHandler((v) => (email = v)).getActiveUserEmail();

  google.script.host.setWidth(200);
  google.script.run
    .withSuccessHandler((v) => (environment = v))
    .getAddOnEnvironment();
</script>

{#if !environment}
  <h1>Vite + Svelte + AppsScript</h1>
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
</style>
