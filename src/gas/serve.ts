const IDX = "index.html"; // file name for svelte output
const APPNAME = `Gather the Docs`;
import { getAddOnEnvironment } from "./addOn";
export function doGet(e) {
  return HtmlService.createHtmlOutputFromFile(IDX);
}

function debugHtml(html: GoogleAppsScript.HTML.HtmlOutput) {
  let htmlString = html.getContent();
  let templateMatch = htmlString.search("contextString");
  if (templateMatch > -1) {
    console.log("Context string found at character:", templateMatch);
    console.log(htmlString.substring(templateMatch - 50, templateMatch + 500));
  } else {
    console.log("contextString not found in HTML???");
  }
  console.log("Full HTML is ", htmlString.length, "characters long...");
  console.log(htmlString);
}

export function showSidebar(params?: string[] | null) {
  let template = HtmlService.createTemplateFromFile(IDX);
  let addOn = getAddOnEnvironment();
  template.context = `${addOn}.sidebar.modeless`;
  if (params) {
    template.context += "." + params.join(".");
  }
  let html = template.evaluate();
  debugHtml(html);
  if (addOn == "Sheets") {
    SpreadsheetApp.getUi().showSidebar(html);
  } else if (addOn == "Docs") {
    DocumentApp.getUi().showSidebar(html);
  } else if (addOn == "Slides") {
    SlidesApp.getUi().showSidebar(html);
  }
}

export function getAppForAddOn(
  addOn: "Slides" | "Docs" | "Sheets" | "Unknown"
) {
  if (addOn == "Slides") {
    return SlidesApp;
  } else if (addOn == "Docs") {
    return DocumentApp;
  } else if (addOn == "Sheets") {
    return SpreadsheetApp;
  }
  throw new Error(`Unknown addOn ${addOn}`);
}

export function showDialog(
  title: string = APPNAME,
  modal = true,
  params?: string[],
  width?: number | undefined,
  height?: number | undefined
) {
  let addOn = getAddOnEnvironment();
  let template = HtmlService.createTemplateFromFile(IDX);
  let context = `${addOn}.dialog.${modal ? "modal" : "modeless"}`;
  if (params) {
    context += "." + params.join(".");
  }

  template.context = context;
  let app = getAppForAddOn(addOn);
  let html = template.evaluate();
  debugHtml(html);
  if (width) {
    html.setWidth(width);
  }
  if (height) {
    html.setHeight(height);
  }
  if (modal) {
    app.getUi().showModalDialog(html, title);
  } else {
    app.getUi().showModelessDialog(html, title);
  }
}
