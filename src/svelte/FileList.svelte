<script lang="ts">
  import DriveFile from "./DriveFile.svelte";
  import Select from "svelte-select";
  import { Card, Icon } from "google-apps-script-svelte-components";
  import { file_copy } from "google-apps-script-svelte-components/dist/icons/file_copy";
  import { drive_file_move } from "google-apps-script-svelte-components/dist/icons/drive_file_move";
  import { done } from "google-apps-script-svelte-components/dist/icons/done";
  import { scanner } from "google-apps-script-svelte-components/dist/icons/scanner";
  import type { DriveLink, LinkToCopy } from "../gas/util/links";
  export let links: DriveLink[];
  export let targetFolder: Folder;
  export let results: {
    copied: string[];
    moved: string[];
    ignored: string[];
  } | null = null;
  export let mode: "choose-action" | "copying" = "choose-action";
  import { createEventDispatcher, onMount } from "svelte";
  import { Folder } from "../gas/copier";

  const dispatch = createEventDispatcher();
  let copyInstructionsById: { [key: string]: LinkToCopy } = {};
  let copyInstructions: LinkToCopy[] = [];

  function makeDefaultInstructions(links, targetFolder) {
    for (let l of links) {
      if (!copyInstructionsById[l.id]) {
        if (l.parentId == targetFolder.id) {
          copyInstructionsById[l.id] = {
            id: l.id,
            action: "ignore", // already in folder - ignore
          };
        } else {
          copyInstructionsById[l.id] = {
            id: l.id,
            action: "copy", // default is "copy" by default
          };
        }
      }
    }
  }
  $: if (mode == "choose-action") {
    makeDefaultInstructions(links, targetFolder);
  }
  $: {
    copyInstructions = Object.values(copyInstructionsById);
    dispatch("instructionsChange", copyInstructions);
  }
  $: for (let key in copyInstructionsById) {
    if (copyInstructionsById[key].action?.value) {
      copyInstructionsById[key].action = copyInstructionsById[key].action.value;
    }
  }
</script>

<Card>
  <slot>
    <h3>
      <Icon icon={scanner.outlined} /> Links
    </h3>
  </slot>
  {#each links as link}
    {@const action = copyInstructionsById[link.id].action}
    <Card depth={3}>
      <div class="row">
        {#if action === "copy"}
          <Icon icon={file_copy.outlined} />
        {:else if action === "move"}
          <Icon icon={drive_file_move.outlined} />
        {:else if action === "ignore"}
          <Icon icon={done.filled} />
        {/if}
        <DriveFile file={link} />
      </div>
      {#if mode == "choose-action"}
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
      {/if}
      {#if mode == "copying"}
        {#if results}
          {#if results.copied?.find((id) => link.id == id)}
            <Icon icon={done.filled} /><Icon icon={file_copy.filled} />
            Copied!
          {:else if results.moved?.find((id) => link.id == id)}
            <Icon icon={done.filled} /><Icon icon={drive_file_move.filled} />
            Moved!
          {:else if results.ignored?.find((id) => link.id == id)}
            <Icon icon={done.filled} />
            Ignored!
          {:else}
            ...
          {/if}
        {/if}
      {/if}
    </Card>
  {/each}
</Card>

<style>
  .vscroll {
    height: 100%;
    overflow-y: auto;
  }
  .row {
    display: flex;
    gap: 8px;
  }
</style>
