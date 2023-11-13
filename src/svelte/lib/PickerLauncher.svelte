<script lang="ts">
  import { GoogleAppsScript } from "../clientApi";
  export let onFolderSelected: (folderId: string) => void = (id: string) =>
    console.log("Selected without a callback: ", id);
  export let onCancel: () => void = () =>
    console.log("Cancelled without a callback");
  import { Button } from "google-apps-script-svelte-components";

  function launchPickerDialog() {
    GoogleAppsScript.pickFolder(
      "folder",
      "Select a Folder to Gather Documents Into"
    );
    checkForFolder();
  }
  async function checkForFolder() {
    let update = await GoogleAppsScript.getFunctionStatus("pickFolder");
    if (update.status == "complete") {
      onFolderSelected(update.metadata.id);
    }
    if (update.status == "interrupted") {
      onCancel();
    }
    setTimeout(checkForFolder, 500);
  }
</script>

<Button on:click={launchPickerDialog}>Launch Picker</Button>
