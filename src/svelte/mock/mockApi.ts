import { DriveLink, CopyResult, LinkToCopy } from "../../gas/util";
import { thumb, mockFolders, mockLinks } from "./data";
export {
  getFunctionStatus,
  interruptFunction,
} from "gas-long-process-poller/dist/mocks";
import { ProcessUpdater } from "gas-long-process-poller/dist/mocks";

export function getActiveUserEmail(): string {
  return "thinkle@example.com";
}

export function testMe(number: number): number {
  return 17;
}

export function foo(s: string): number {
  return 17;
}

export function getAddOnEnvironment():
  | "Slides"
  | "Docs"
  | "Sheets"
  | "Unknown" {
  //  return null; // TODO: Replace with mock return value of type "Slides" | "Docs" | "Sheets" | "Unknown"
  return "Slides";
}

export function createFolderForDocument(
  id: string,
  name: string,
  parentId: string
): import("../../gas/copier").Folder {
  //return null; // TODO: Replace with mock return value of type import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/copier").Folder
  return {
    name,
    id: "" + (Math.random() * 10000000).toFixed(0),
  };
}

export function getFolderForDocument(
  id: string
): import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/copier").Folder {
  return null; // TODO: Replace with mock return value of type import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/copier").Folder
}

export function setFolderForDocument(id: any, folderId: any): void {}

export function copyLinksInPresentation(
  presentationId: string,
  targetFolderId: string,
  linksToCopy?: LinkToCopy[]
): CopyResult[] {
  let interval = 1000;
  let updater = new ProcessUpdater("copyLinksInPresentation", {
    name: "Copy Links in Presentation",
    description: "Copying all links in a presentation to target folder",
    status: "running",
  });
  let copyAction = updater.addAction({
    name: "Copying links",
    description: "Copying link",
    total: linksToCopy.length,
    current: 0,
    metadata: {
      copied: [],
      moved: [],
      ignored: [],
    },
  });
  let results: CopyResult[] = [];
  let idx = 0;
  linksToCopy.forEach((l, idx) => {
    interval += 1000;
    setTimeout(() => {
      copyAction.action.current++;
      if (l.action == "copy") {
        copyAction.action.metadata.copied.push(l.id);
      } else if (l.action == "move") {
        copyAction.action.metadata.moved.push(l.id);
      } else {
        copyAction.action.metadata.ignored.push(l.id);
      }
      let driveLink = mockLinks.find((link) => link.id == l.id);
      results.push({
        link: driveLink,
        status: "success",
        action: l.action,
        newUrl: l.action == "copy" && driveLink.url + "-copy-asera98asdfr",
      });
      updater.doUpdate();
    }, interval);
    idx++;
    interval += 1500;
  });
  // Fix me
  return results;
}

export function getActivePresentation(): import("../../gas/slides/slidesAddOn").Document {
  return {
    id: "1234",
    name: "Slides Presentation",
    thumbnail: "aslkdjrf",
    parent: {
      id: "1234",
      name: "Slides Parent Folder",
    },
  };
}

export function hello(): string {
  return "hello";
}

export function harvestLinksFromActivePresentation(): DriveLink[] {
  return mockLinks;
}

export function getFolderInfo(
  folderId: string
): import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/copier").Folder {
  let existing = mockFolders.find((f) => f.id == folderId);
  if (existing) {
    return existing;
  } else {
    return {
      name: "Mock Folder",
      id: folderId,
      url: "https://drive.google.com/drive/folders/" + folderId,
    };
  }
}


export function getOAuthToken(): string {
  return "hello"
}

export function getApiKey(): string {
  return "hello"
}

export function showDialog(title?: string, modal?: boolean): void {
  
}

export function showSidebar(): void {
  
}

export function onPickerCancel(): void {
  
}

export function onPickerComplete(id: string): void {
  
}

export function pickFolder(filetype?: "folder", title?: string): void {
  
}