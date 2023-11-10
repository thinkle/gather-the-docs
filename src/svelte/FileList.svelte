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
  export let links: DriveLink[];
  import { createEventDispatcher, onMount } from "svelte";
  import { GoogleAppsScript } from "./clientApi";
  import type { Document } from "../gas/slides/slidesAddOn";
  import type { Folder } from "../gas/copier";
  import type { ProcessUpdate } from "gas-long-process-poller";
  const dispatch = createEventDispatcher();
  let copyInstructionsById: { [key: string]: LinkToCopy } = {};
  let copyInstructions: LinkToCopy[] = [];

  function makeDefaultInstructions(links) {
    for (let l of links) {
      if (!copyInstructionsById[l.id]) {
        copyInstructionsById[l.id] = {
          id: l.id,
          action: "copy", // hardcoded default for now
        };
      }
    }
  }
  $: makeDefaultInstructions(links);
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
    <div>
      {#if action === "copy"}
        <Icon icon={file_copy.outlined} />
      {:else if action === "move"}
        <Icon icon={drive_file_move.outlined} />
      {:else if action === "ignore"}
        <Icon icon={done.filled} />
      {/if}
      <a target="_blank" href={link.url}>{link.origin.text} => {link.title}</a>

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

<style>
  .vscroll {
    height: 100%;
    overflow-y: auto;
  }
</style>
