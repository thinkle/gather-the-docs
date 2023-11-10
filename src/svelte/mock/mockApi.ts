import { DriveLink, CopyResult, LinkToCopy } from "../../gas/util";
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
  updater.addAction({
    name: "Copying links",
    description: "Copying link",
    total: linksToCopy.length,
    current: 0,
  });
  for (let l of linksToCopy) {
    interval += 1000;
    setInterval(() => {
      updater.currentAction.current++;
    }, interval);
    interval += 500;
  }
  // Fix me
  return [];
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

let mockLinks: DriveLink[] = [
  {
    url: "https://drive.google.com/file/d/1JZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2/view?usp=sharing",
    id: "1JZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2",
    title: "Mock Link 1",
    thumbnail: new Blob(),
    mimetype: "application/vnd.google-apps.document",
    changeUrl: (newUrl: string) => {},
    accessible: true,
    origin: {
      originId: "123901820191234",
      originMimetype: "application/vnd.google-apps.presentation",
      text: "Mock Link 1",
    },
  },
  {
    url: "https://drive.google.com/file/d/2JZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2/view?usp=sharing",
    id: "2JZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2",
    title: "Mock Link 2",
    thumbnail: new Blob(),
    mimetype: "application/vnd.google-apps.spreadsheet",
    changeUrl: (newUrl: string) => {},
    accessible: true,
    origin: {
      originId: "123901820191234",
      originMimetype: "application/vnd.google-apps.presentation",
      text: "Amazing document!",
    },
  },
  {
    url: "https://drive.google.com/file/d/3JZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2/view?usp=sharing",
    id: "3JZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2",
    title: "Mock Link 3",
    thumbnail: new Blob(),
    mimetype: "application/vnd.google-apps.drawing",
    changeUrl: (newUrl: string) => {},
    accessible: true,
    origin: {
      originId: "123901820191234",
      originMimetype: "application/vnd.google-apps.presentation",
      text: "My 3rd Document",
    },
  },
  {
    url: "https://drive.google.com/file/d/3JZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2/view?usp=sharing",
    id: "3JZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2",
    title: "Mock Link 3",
    thumbnail: new Blob(),
    mimetype: "application/vnd.google-apps.drawing",
    changeUrl: (newUrl: string) => {},
    accessible: false,
    origin: {
      originId: "123901820191234",
      originMimetype: "application/vnd.google-apps.presentation",
      text: "See Mock Doc # 4",
    },
  },
];

export function harvestLinksFromActivePresentation(): DriveLink[] {
  return mockLinks;
}
