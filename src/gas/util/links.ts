import { SlidesType, DocType, SpreadsheetType, SitesType } from "./types";
import type { Folder } from "../copier";

export type CopyResult = {
  link: DriveLink;
  status: "success" | "error";
  newUrl?: string;
  error?: string;
  action: "move" | "copy" | "ignore";
};

export type LinkToCopy = {
  id: string;
  action: "copy" | "move" | "ignore";
  origin?: Metadata;
};

export type Metadata = {
  page?: number;
  originMimetype: string;
  originId: string;
  text: string;
  icon?: string;
  thumbnail?: string;
};
export type Link = {
  url: string;
  metadata: Metadata;
  changeUrl: (url) => void;
};

export type DriveLink = {
  url: string;
  id: string;
  accessible: boolean;
  mimetype?: string;
  changeUrl: (url) => void;
  thumbnail?: string;
  title?: string;
  origin: Metadata;
  parentId?: string;
};

export function getDriveLinks(links: Link[]): DriveLink[] {
  let driveLinks: DriveLink[] = [];
  for (let link of links) {
    if (isGoogleDriveLink(link.url)) {
      let linkedFileId = extractFileId(link.url);
      try {
        var driveFile = DriveApp.getFileById(linkedFileId);
      } catch (err) {
        console.log("Unable to access ", driveFile);
        driveLinks.push({
          changeUrl: link.changeUrl,
          url: link.url,
          id: linkedFileId,
          accessible: false,
          origin: link.metadata,
        });
        continue;
      }
      if (driveFile) {
        let mimetype: string,
          parentId: string,
          thumbnail: string,
          title: string;
        try {
          mimetype = driveFile.getMimeType();
        } catch (err) {
          mimetype = "unknown";
        }
        try {
          parentId = driveFile.getParents().next().getId();
        } catch (err) {
          console.log("No parent for doc?", driveFile.getId());
        }
        try {
          thumbnail = driveFile.getThumbnail().getDataAsString();
        } catch (err) {
          thumbnail = "";
        }
        try {
          title = driveFile.getName();
        } catch (err) {
          title = "";
        }

        driveLinks.push({
          changeUrl: link.changeUrl,
          url: link.url,
          id: linkedFileId,
          accessible: true,
          mimetype,
          parentId,
          thumbnail,
          title,
          origin: { ...link.metadata },
        });
      }
    }
  }
  return driveLinks;
}

export function getFolderInfo(folderId: string): Folder {
  let folder = DriveApp.getFolderById(folderId);
  return {
    id: folder.getId(),
    name: folder.getName(),
    url: folder.getUrl(),
  };
}

function isGoogleDriveLink(url: string): boolean {
  if (!url) {
    return false;
  }
  const patterns = [
    "drive.google.com",
    "docs.google.com",
    "sheets.google.com",
    "slides.google.com",
    // Add other Google service domains if necessary
  ];
  return patterns.some((pattern) => url.includes(pattern));
}

function extractFileId(url: string): string {
  // Adjusted to capture file IDs from multiple Google Drive URL formats
  let match = url.match(/\/d\/([^/]+)\//) || url.match(/\/file\/d\/([^/]+)\//);
  return match ? match[1] : "";
}
