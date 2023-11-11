import type { AddOnInterface } from "../addOn";
import { Folder, copyFile } from "../copier";
import { harvestLinksFromActivePresentation } from "./harvestLinksSlides";
import type { CopyResult, DriveLink, LinkToCopy } from "../util/links";
import { ProcessUpdater } from "gas-long-process-poller";
export const slidesAddOn: AddOnInterface = {
  initUi() {
    return SlidesApp.getUi();
  },
  addToMenu(menu: GoogleAppsScript.Base.Menu) {
    menu.addItem("test harvest", "harvestLinksFromActivePresentation");
    menu.addItem("test copy", "testCopy");
    menu.addItem("Gather the Docs!", "showDialog");
    menu.addItem("Gather the Docs (Side)!", "showSidebar");
  },
};

export function copyLinksInPresentation(
  presentationId: string,
  targetFolderId: string,
  linksToCopy?: LinkToCopy[],
  actionForUnknown: "move" | "copy" | "ignore" = "ignore"
): CopyResult[] {
  let updater = new ProcessUpdater("copyLinksInPresentation", {
    name: "Copy Links in Presentation",
    description: "Copying all links in a presentation to target folder",
    status: "running",
  });
  let linkAction = updater.addAction({
    name: "Finding Links",
    description: "Finding links in presentation",
  });
  let links = harvestLinksFromActivePresentation();
  linkAction.complete({
    description: `Found ${links.length} links`,
  });
  let copyAction = updater.addAction({
    name: "Copying links",
    total: links.length,
    current: 0,
    description: "Copying links to target folder",
    metadata: {
      copied: [],
      moved: [],
      ignored: [],
    },
  });
  let results: CopyResult[] = [];
  for (let l of links) {
    let action =
      linksToCopy?.find((link) => link.id == l.id)?.action || actionForUnknown;
    if (action === "copy") {
      try {
        let copy = copyFile(l.id, targetFolderId);
        copyAction.action.metadata.copied.push(copy.getId());
        l.changeUrl(copy.getUrl());
        results.push({
          link: l,
          newUrl: copy.getUrl(),
          action: "copy",
          status: "success",
        });
      } catch (e) {
        results.push({
          link: l,
          action: "copy",
          status: "error",
          error: e.toString(),
        });
      }
    } else if (action == "move") {
      try {
        DriveApp.getFileById(l.id).moveTo(
          DriveApp.getFolderById(targetFolderId)
        );
        copyAction.action.metadata.moved.push(l.id);
        results.push({
          link: l,
          newUrl: l.url,
          action: "move",
          status: "success",
        });
      } catch (e) {
        results.push({
          link: l,
          action: "move",
          status: "error",
          error: e.toString(),
        });
      }
    } else if (action == "ignore") {
      copyAction.action.metadata.ignored.push(l.id);
      results.push({
        link: l,
        action: "ignore",
        status: "success",
      });
    }
    copyAction.action.current++;
    updater.doUpdate();
  }
  updater.completeProcess();
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
