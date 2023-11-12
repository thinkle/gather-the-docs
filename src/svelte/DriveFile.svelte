<script context="module" lang="ts">
  import { Icon, Card, IconButton } from "google-apps-script-svelte-components";
  import { folder } from "google-apps-script-svelte-components/dist/icons/folder";
  import { link_off } from "google-apps-script-svelte-components/dist/icons/link_off";
  import { info } from "google-apps-script-svelte-components/dist/icons/info";
  import { GoogleAppsScript } from "./clientApi";
  import type { Folder } from "../gas/copier";
  const parentCache = {};
  async function getParentFolder(id) {
    if (!parentCache[id]) {
      parentCache[id] = await GoogleAppsScript.getFolderInfo(id);
      return parentCache[id];
    }
    return parentCache[id];
  }
</script>

<script lang="ts">
  import type { DriveLink } from "../gas/util/";
  import { link } from "google-apps-script-svelte-components/dist/icons/link";

  export let file: DriveLink;
  let parentFolder: Folder | null;
  async function updateParentFolder(id) {
    parentFolder = null; // empty while we fetch
    parentFolder = await getParentFolder(id);
  }
  $: if (file.parentId) {
    updateParentFolder(file.parentId);
  }
  let defaultIcon = link.twoTone;
  $: if (!file.accessible) {
    defaultIcon = link_off.twoTone;
  }
  let infoMode = false;
</script>

<div class="drive-file" class:inaccessible={!file.accessible}>
  <Card>
    <div class="title">
      {file.title}
    </div>
    <div class="info-control">
      <IconButton
        on:click={() => (infoMode = !infoMode)}
        icon={infoMode ? info.filled : info.outlined}
      />
    </div>
    <div
      class="body"
      class:has-thumb={!!file.thumbnail}
      style:--bg="url({file.thumbnail})"
    >
      {#if !file.thumbnail}
        <Icon icon={defaultIcon} />
      {/if}
    </div>
    <div class="footer">
      {#if parentFolder}
        <Icon icon={folder.outlined} />
        <a href={parentFolder.url}>{parentFolder.name}</a>
      {/if}
    </div>
    {#if infoMode}
      <div class="expanded-info">
        <div class="id">
          <label>Title</label>
          <div>{file.title}</div>
        </div>
        {#if file.origin}
          <div class="link">
            <label>Link</label>
            <div>
              <a href={file.url}>
                {file.origin.text}
              </a>
            </div>
            {#if file.origin.page}
              <div>On page: {file.origin.page}</div>
            {/if}
          </div>
        {/if}
        <div class="url">
          <label>Url</label>
          <div>
            <a href={file.url}>{file.url} </a>
          </div>
        </div>
        <div class="mimeType">
          <label>Mime Type</label>
          <div>{file.mimetype}</div>
        </div>
        {#if parentFolder}
          <div class="parent">
            <label>Parent</label>
            <div>
              <a href={parentFolder.url}>
                {parentFolder.name}
              </a>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </Card>
</div>

<style>
  .expanded-info {
    background-color: var(--white, white);
    position: absolute;
    top: 0;
    left: 0;
    width: var(--width);
    z-index: 2;
  }
  .expanded-info label {
    color: #666;
    font-size: small;
  }
  .expanded-info > div {
    margin-bottom: 16px;
    word-wrap: break-word;
  }
  .drive-file {
    position: relative;
  }
  .info-control {
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 3;
  }
  .title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: bold;
  }
  .body.has-thumb {
    background-image: var(--bg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom center;
    height: var(--width);
  }
  .drive-file {
    --width: 128px;
    width: var(--width);
  }
  .inaccessible {
    opacity: 0.5;
  }
  .info-button {
  }
</style>
