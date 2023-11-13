<script lang="ts">
  import { GoogleAppsScript } from "./clientApi";
  import type { Document } from "../gas/slides/slidesAddOn";
  import type { Folder } from "../gas/copier";
  import PickerLauncher from "./lib/PickerLauncher.svelte";
  import { clear } from "google-apps-script-svelte-components/dist/icons/clear";
  import {
    Icon,
    IconButton,
    Card,
    Expander,
    Button,
  } from "google-apps-script-svelte-components";
  import { folder } from "google-apps-script-svelte-components/dist/icons/folder";
  import { create_new_folder } from "google-apps-script-svelte-components/dist/icons/create_new_folder";

  export let parentDoc: Document;
  export let targetFolder: Folder;
  let newFolderName: string = parentDoc?.name
    ? parentDoc.name + " Documents"
    : "";
  $: if (!newFolderName && parentDoc?.name) {
    newFolderName = parentDoc.name + " Documents";
  }

  async function createFolder() {
    targetFolder = await GoogleAppsScript.createFolderForDocument(
      parentDoc.id,
      newFolderName,
      parentDoc.parent.id
    );
  }

  async function selectFromId(id) {
    console.log("Get folder with ID:", id);
    targetFolder = await GoogleAppsScript.getFolderInfo(id);
  }
  export let expanded: boolean = false;
</script>

<Expander {expanded}>
  <h3 slot="label">
    <Icon icon={(targetFolder && folder.filled) || folder.outlined} />
    Choose a Folder
  </h3>
  {#if !parentDoc}
    <!-- No parent doc, no folder selector -->
  {:else if targetFolder}
    <div class="folder">
      <Icon icon={folder.outlined} />
      {targetFolder.name}
    </div>
    <IconButton icon={clear.outlined} on:click={() => (targetFolder = null)} />
  {:else}
    <div class="folder">
      <label>
        <div class="label">Folder Name:</div>
        <input bind:value={newFolderName} />
      </label>
      <div class="button-row">
        <Button color="blue" on:click={createFolder}>
          <Icon icon={create_new_folder.outlined} />
          Create Folder
        </Button>
      </div>
    </div>
    <PickerLauncher onFolderSelected={(id) => selectFromId(id)} />
  {/if}
</Expander>

<style>
  input,
  .label,
  .button-row {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 8px;
  }

  .button-row {
    display: flex;
    justify-content: flex-end;
  }
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
  }
</style>
