import { ProcessUpdater, ProcessUpdate } from "gas-long-process-poller";
import { showDialog } from "../serve";

function getPickerUpdater() {
  return new ProcessUpdater("pickFolder");
}

/* pickFolder launches a google picker dialog.
We will need to gas-long-process-poller to find out the result
as we cannot run this code synchronously.

So our usage pattern is...

google.script.run.pickFolder()

And then we poll the function pickFolder until complete.
*/
export function pickFolder(
  filetype: "folder" = "folder",
  title: string = "Choose Folder"
) {
  let pickerProcess = getPickerUpdater();
  pickerProcess.processUpdate.status = "running";
  pickerProcess.doUpdate();
  showDialog(title, true, ["picker", filetype], 1000, 600);
}

export function onPickerComplete(id: string) {
  let pickerProcess = getPickerUpdater();
  pickerProcess.processUpdate.status = "complete";
  pickerProcess.processUpdate.metadata = {
    id,
  };
  pickerProcess.doUpdate();
}

export function onPickerCancel() {
  let pickerProcess = getPickerUpdater();
  pickerProcess.processUpdate.status = "interrupted";
  pickerProcess.doUpdate();
}
