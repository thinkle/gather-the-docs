<script lang="ts">
  import FileList from "./FileList.svelte";

  import FolderSelector from "./FolderSelector.svelte";
  import Select from "svelte-select";
  import {
    Button,
    Card,
    Icon,
    Expander,
  } from "google-apps-script-svelte-components";
  import { file_copy } from "google-apps-script-svelte-components/dist/icons/file_copy";
  import { drive_file_move } from "google-apps-script-svelte-components/dist/icons/drive_file_move";
  import { done } from "google-apps-script-svelte-components/dist/icons/done";
  import { refresh } from "google-apps-script-svelte-components/dist/icons/refresh";
  import { scanner } from "google-apps-script-svelte-components/dist/icons/scanner";
  import type { CopyResult, DriveLink, LinkToCopy } from "../gas/util/links";
  import { onMount } from "svelte";
  import { GoogleAppsScript } from "./clientApi";
  import type { Document } from "../gas/slides/slidesAddOn";
  import type { Folder } from "../gas/copier";
  import type { ProcessUpdate } from "gas-long-process-poller";
  let presentation: Document;
  let targetFolder: Folder;
  onMount(async () => {
    console.log("Slides.svelte: Fire off requests");
    presentation = await GoogleAppsScript.getActivePresentation();
    console.log("Slides.svelte: Got presentation", presentation);
    targetFolder = await GoogleAppsScript.getFolderForDocument(presentation.id);
    console.log("Slides.svelte: getFolder=>", targetFolder);
    getLinks();
  });

  let copying;
  let results: CopyResult[];
  let copyStatus: ProcessUpdate;
  let links: DriveLink[] = [];
  let fetchingLinks = false;
  let copyInstructions: LinkToCopy[] = [];

  $: console.log("Instructions are:", copyInstructions);
  async function getLinks() {
    console.log("Fetch those links!");
    fetchingLinks = true;
    links = await GoogleAppsScript.harvestLinksFromActivePresentation();
    fetchingLinks = false;
  }

  async function doCopy() {
    copying = true;
    let updaterInterval = setInterval(async () => {
      copyStatus = await GoogleAppsScript.getFunctionStatus(
        "copyLinksInPresentation"
      );
    }, 500);
    results = await GoogleAppsScript.copyLinksInPresentation(
      presentation.id,
      targetFolder.id,
      copyInstructions
    );
    clearInterval(updaterInterval);
    copying = false;
  }
</script>

<h2>Slides Add-On</h2>
<section class="vscroll">
  <FolderSelector expanded={true} parentDoc={presentation} bind:targetFolder />

  {#if presentation}
    <Expander expanded={targetFolder}>
      <h3 slot="label">Documents in {presentation.name}</h3>
      <FileList
        {links}
        on:instructionsChange={(e) => (copyInstructions = e.detail)}
      >
        {#if fetchingLinks}
          <div>
            <em>Scanning document for links...</em>
          </div>
        {:else}
          <Button on:click={getLinks}>
            {#if links.length}
              <Icon icon={refresh.outlined} />
              Rescan
            {:else}
              <Icon icon={scanner.outlined} />
              Scan
            {/if} for documents</Button
          >
        {/if}
      </FileList>
    </Expander>
    {#if links.length && targetFolder}
      <Card>
        <h2>Gather the Docs!</h2>
        <p>Ok, the plan is to:</p>
        <ul>
          {#if copyInstructions.find((i) => i.action === "copy")}
            <li>
              <Icon icon={file_copy.outlined} />
              copy {copyInstructions.filter((i) => i.action === "copy").length}
              documents
            </li>
          {/if}
          {#if copyInstructions.find((i) => i.action === "move")}
            <li>
              <Icon icon={drive_file_move.outlined} />
              move {copyInstructions.filter((i) => i.action === "move").length}
              documents.
            </li>
          {/if}
          {#if copyInstructions.find((i) => i.action === "ignore")}
            <li>
              <Icon icon={done.outlined} />
              ignore {copyInstructions.filter((i) => i.action === "move")
                .length}
              documents.
            </li>
          {/if}
        </ul>
        {#if copying}
          Copying Documents...
        {:else}
          <Button color="red" disabled={copying} on:click={doCopy}>
            Let's gather those documents!
          </Button>
        {/if}
      </Card>
    {/if}
  {/if}
  {#if copyStatus}
    <Expander expanded={!results}>
      <h2 slot="label">{copyStatus.name}</h2>
      <p>{copyStatus.description}</p>
      {#each copyStatus.actions as action}
        <br />{action.name}: {action.description}
        {#if action.total}
          <progress value={action.current} max={action.total} />
        {/if}
      {/each}
    </Expander>
  {/if}

  {#if results}
    <Card>
      <h2>Complete!</h2>
      <ul>
        {#each results as result}
          <li
            class:moved={result.action == "move"}
            class:copied={result.action == "copy"}
            class:ignored={result.action == "ignore"}
          >
            {#if result.action == "copy"}
              <Icon icon={file_copy.filled} />
              Copied
            {:else if result.action == "move"}
              <Icon icon={drive_file_move.filled} />
              Moved
            {:else}
              <Icon icon={done.filled} />
              Ignored
            {/if}
            <a target="_blank" href={result.newUrl || result.link.url}
              >{result.link.title}</a
            >
          </li>
        {/each}
      </ul>
    </Card>
  {/if}
</section>

<style>
  section {
    --margin-left: 0;
  }
  .vscroll {
    height: 100%;
    overflow-y: auto;
  }
</style>
