<script>
  import { onMount } from "svelte";
  import { GoogleAppsScript } from "../clientApi";

  let pickerReady = false;
  let authToken;
  let key;

  onMount(async () => {
    authToken = await GoogleAppsScript.getOAuthToken();
    key = await GoogleAppsScript.getApiKey();
    if (!window.gapi) {
      await loadGapiScript();
    }
    gapi.load("picker", { callback: onPickerApiLoad });
  });

  function onPickerApiLoad() {
    if (gapi && google && google.picker) {
      // Picker API is successfully loaded
      pickerReady = true;
      createPicker();
    } else {
      console.error("Failed to load Google Picker API");
    }
  }

  async function loadGapiScript() {
    try {
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error("Failed to load the gapi script"));
        document.body.appendChild(script);
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async function onPickerSelected(data) {
    console.log("Picker callback", data);
    try {
      if (data.action == google.picker.Action.PICKED) {
        const fileId = data.docs[0].id;
        console.log("The user selected: " + fileId);
        await GoogleAppsScript.onPickerComplete(fileId);
        google.script.host.close();
      }
    } catch (err) {
      console.log("Error getting data from picker callback");
    }
  }

  function createPicker() {
    // Implement Picker creation logic here
    // Ensure you have the OAuth token and API key ready
    console.log("Auth token is ", authToken);
    console.log("Key is", key);
    // See: https://stackoverflow.com/questions/21173883/select-folder-with-google-picker
    var docsView = new google.picker.DocsView()
      .setIncludeFolders(true)
      .setMimeTypes("application/vnd.google-apps.folder")
      .setSelectFolderEnabled(true);
    console.log("Created docsView", docsView);
    var picker = new google.picker.PickerBuilder()
      .addView(docsView)
      .enableFeature(google.picker.Feature.NAV_HIDDEN)
      // Hide title bar since dialog has a title
      .hideTitleBar()
      .setOrigin(google.script.host.origin)
      .setOAuthToken(authToken)
      .setDeveloperKey(key)
      .setCallback(onPickerSelected)
      .build();
    console.log("Created picker");
    picker.setVisible(true);
  }
</script>

{#if !pickerReady || !authToken}
  <div>
    <em>Loading...</em>
  </div>
{/if}
