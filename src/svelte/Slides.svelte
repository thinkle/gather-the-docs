<script lang="ts">
  import FolderSelector from "./FolderSelector.svelte";
  import Select from "svelte-select";
  import { Button, Card, Icon } from "google-apps-script-svelte-components";
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
  let copyInstructionsById: { [key: string]: LinkToCopy } = {};
  let copyInstructions: LinkToCopy[] = [];
  $: copyInstructions = Object.values(copyInstructionsById);
  $: for (let key in copyInstructionsById) {
    if (copyInstructionsById[key].action?.value) {
      copyInstructionsById[key].action = copyInstructionsById[key].action.value;
    }
  }
  $: console.log("Instructions are:", copyInstructions);
  async function getLinks() {
    console.log("Fetch those links!");
    fetchingLinks = true;
    links = await GoogleAppsScript.harvestLinksFromActivePresentation();
    fetchingLinks = false;
    for (let l of links) {
      if (!copyInstructionsById[l.id]) {
        copyInstructionsById[l.id] = {
          id: l.id,
          action: "copy", // hardcoded default for now
        };
      }
    }
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
      targetFolder.id
    );
    clearInterval(updaterInterval);
    copying = false;
  }
</script>

<h2>Slides Add-On</h2>
<section class="vscroll">
  <FolderSelector parentDoc={presentation} bind:targetFolder />
  {#if presentation}
    <Card>
      <h3>Documents in {presentation.name}</h3>
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
      {#each links as link}
        {@const action = copyInstructionsById[link.id].action}
        <div>
          {#if action === "copy"}
            <Icon icon={file_copy.outlined} />
          {:else if action === "move"}
            <Icon icon={drive_file_move.outlined} />
          {:else if action === "ignore"}
            <Icon icon={done.filled} />
          {/if}
          <a target="_blank" href={link.url}
            >{link.origin.text} => {link.title}</a
          >

          <Select
            bind:value={copyInstructionsById[link.id].action}
            items={[
              { value: "copy", label: "Copy", icon: file_copy.outlined },
              { value: "move", label: "Move", icon: drive_file_move.outlined },
              { value: "ignore", label: "Ignore", icon: done.outlined },
            ]}
          >
            <div slot="item" let:item>
              <Icon icon={item.icon} />
              <span>{item.label}</span>
            </div>
          </Select>
        </div>
      {/each}
    </Card>
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
              <Icon icon={drive_file_move.done} />
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

  {#if results}
    OMG we copied so many things! {results.length}
    {JSON.stringify(results)}
  {/if}
</section>

<style>
  .vscroll {
    height: 100%;
    overflow-y: auto;
  }
</style>
