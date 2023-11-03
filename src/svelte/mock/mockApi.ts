export function getActiveUserEmail(): string {
  return "thinkle@example.com";
}

export function testMe(number: number): number {
  return 17;
}

export function foo(s: string): number {
  return 17;
}


export function getAddOnEnvironment(): "Slides" | "Docs" | "Sheets" | "Unknown" {
  return null; // TODO: Replace with mock return value of type "Slides" | "Docs" | "Sheets" | "Unknown"
}

export function createFolderForDocument(id: string, name: string, parentId: string): import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/copier").Folder {
  return null; // TODO: Replace with mock return value of type import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/copier").Folder
}

export function getFolderForDocument(id: string): import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/copier").Folder {
  return null; // TODO: Replace with mock return value of type import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/copier").Folder
}

export function setFolderForDocument(id: any, folderId: any): void {
  
}

export function copyLinksInPresentation(presentationId: string, targetFolderId: string): { link: import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/util/links").DriveLink; newUrl: string; }[] {
  return null; // TODO: Replace with mock return value of type { link: import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/util/links").DriveLink; newUrl: string; }[]
}

export function getActivePresentation(): import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/slides/slidesAddOn").Document {
  return null; // TODO: Replace with mock return value of type import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/slides/slidesAddOn").Document
}

export function getFunctionStatus(fname: string): import("/Users/thinkle/Projects/gas-long-process-poller/dist/status").ProcessUpdate {
  return null; // TODO: Replace with mock return value of type import("/Users/thinkle/Projects/gas-long-process-poller/dist/status").ProcessUpdate
}