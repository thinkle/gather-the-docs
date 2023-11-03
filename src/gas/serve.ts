const IDX = "index.html"; // file name for svelte output
const APPNAME = `Gather the Docs`;

export function doGet(e) {
  return HtmlService.createHtmlOutputFromFile(IDX);
}

export function showDialog(
  title: string = APPNAME,
  modal = true,
  app:
    | typeof DocumentApp
    | typeof SpreadsheetApp
    | typeof SlidesApp = DocumentApp
) {
  let html = HtmlService.createHtmlOutputFromFile(IDX);
  if (modal) {
    app.getUi().showModalDialog(html, title);
  } else {
    app.getUi().showModelessDialog(html, title);
  }
}
export const showDocDialog = showDialog;
export function showSpreadsheetDialog(title: string, modal = true) {
  showDialog(title, modal, SpreadsheetApp);
}
export function showSlidesDialog(title: string, modal = true) {
  showDialog(title, modal, SlidesApp);
}
