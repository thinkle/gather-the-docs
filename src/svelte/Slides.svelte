<script lang="ts">
  import FolderSelector from "./FolderSelector.svelte";

  import type { DriveLink } from "../gas/util/links";
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
  });

  let copying;
  let results: {
    newUrl: string;
    link: DriveLink;
  }[];
  let copyStatus: ProcessUpdate;
  async function doCopy() {
    copying = true;
    let updaterInterval = setInterval(async () => {
      copyStatus = await GoogleAppsScript.getFunctionStatus(
        "copyLinksInPresentation"
      );
    }, 500);
    results = await GoogleAppsScript.copyLinksInPresentation(
      presentation.id,
      targetFolder.id
    );
    clearInterval(updaterInterval);
    copying = false;
  }
</script>

<h2>Slides Add-On</h2>
<FolderSelector parentDoc={presentation} bind:targetFolder />
{#if targetFolder && !results}
  <p>Ok, clicking this button will do a few things...</p>
  <ul>
    <li>Crawl this slideshow for links to documents.</li>
    <li>
      Everywhere possible, make a new copy of the document in the folder
      <span class="folder">{targetFolder.name}</span>
    </li>
    <li>Change the links in the slideshow to point to our copies.</li>
  </ul>
  <p>
    The effect will be making an archival copy of everything linked in the
    slideshow!
  </p>
  {#if copyStatus}
    <h2>{copyStatus.name}</h2>
    <p>{copyStatus.description}</p>
    {#each copyStatus.actions as action}
      <br />{action.name}: {action.description}
      <br />{action.startTime}-{action.endTime}
      <br />{action.status}
      {#if action.total}
        <br />{action.current}/{action.total}
      {/if}
    {/each}
  {/if}
  <button disabled={copying} on:click={doCopy}
    >Let's copy those documents!</button
  >
{/if}
{#if results}
  OMG we copied so many things! {results.length}
  {JSON.stringify(results)}
{/if}
