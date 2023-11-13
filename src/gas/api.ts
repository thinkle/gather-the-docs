/* Export all functions you'll want to call with 
google.script.run here -- this will allow our type
definition magic to work, so in your svelte side code
you get clean autocomplete for google.script.run */

export { onPickerCancel, onPickerComplete, pickFolder } from "./picker/picker";

export { getFolderInfo } from "./util";

export { harvestLinksFromActivePresentation } from "./main";
export { copyLinksInPresentation } from "./slides/slidesAddOn";
export { getActivePresentation } from "./slides/slidesAddOn";
export { getActiveUserEmail } from "./copier";
export { getFunctionStatus } from "gas-long-process-poller";
export { getAddOnEnvironment } from "./addOn";
export function getOAuthToken() {
  return ScriptApp.getOAuthToken();
}
export function getApiKey() {
  return PropertiesService.getScriptProperties().getProperty("key");
}

export {
  createFolderForDocument,
  getFolderForDocument,
  setFolderForDocument,
} from "./copier";
