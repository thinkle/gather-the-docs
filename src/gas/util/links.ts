import { SlidesType, DocType, SpreadsheetType, SitesType } from "./types";

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
  thumbnail?: GoogleAppsScript.Base.Blob;
  title?: string;
  origin: Metadata;
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
        let mimetype = driveFile.getMimeType();
        driveLinks.push({
          changeUrl: link.changeUrl,
          url: link.url,
          id: linkedFileId,
          accessible: true,
          mimetype,
          thumbnail: driveFile.getThumbnail(),
          title: driveFile.getName(),
          origin: { ...link.metadata },
        });
      }
    }
  }
  return driveLinks;
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
