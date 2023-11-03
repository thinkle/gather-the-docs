import type { AddOnInterface } from "../addOn";
import { Folder, copyFile } from "../copier";
import { harvestLinksFromActivePresentation } from "./harvestLinksSlides";
import type { DriveLink } from "../util/links";
export const slidesAddOn: AddOnInterface = {
  initUi() {
    return SlidesApp.getUi();
  },
  addToMenu(menu: GoogleAppsScript.Base.Menu) {
    menu.addItem("test harvest", "harvestLinksFromActivePresentation");
    menu.addItem("test copy", "testCopy");
    menu.addItem("Gather the Docs!", "showSlidesDialog");
  },
};

// First version: we'll need to fix this to be
// more asynchronous and allow updates as to progress
// and picking up after interruption...
export function copyLinksInPresentation(
  presentationId: string,
  targetFolderId: string
): {
  link: DriveLink;
  newUrl: string;
}[] {
  let links = harvestLinksFromActivePresentation();
  let results: { link: DriveLink; newUrl: string }[] = [];
  for (let l of links) {
    let copy = copyFile(l.id, targetFolderId);
    l.changeUrl(copy.getUrl());
    results.push({
      link: l,
      newUrl: copy.getUrl(),
    });
  }
  return results;
}

export function testCopy() {
  let links = harvestLinksFromActivePresentation();

  console.log("Got ", links.length, "links!");
  for (let l of links) {
    let targetFolderId = "1YU_ePC7WkfWofUgf4Dt3pmmudWfnADE_";
    try {
      let copy = copyFile(l.id, targetFolderId);
      console.log("Copied file ", l.id, "=>", copy.getId());
      l.changeUrl(copy.getUrl());
      console.log("Successfully changed a link!");
    } catch (err) {
      console.log("Error making copy of", l.id, err);
      console.log(l);
    }
  }
}

export type Document = {
  name: string;
  id: string;
  thumbnail: string;
  parent: Folder;
};
export function getActivePresentation(): Document {
  let presentation = SlidesApp.getActivePresentation();
  if (!presentation) {
    throw new Error("Unable to get active presentation");
  }
  let parent = DriveApp.getFileById(presentation.getId()).getParents().next();
  return {
    name: presentation.getName(),
    id: presentation.getId(),
    thumbnail: DriveApp.getFileById(presentation.getId())
      .getThumbnail()
      .getDataAsString(),
    parent: {
      id: parent.getId(),
      name: parent.getName(),
    },
  };
}
