
export const GoogleAppsScript = {
  
     harvestLinksFromActivePresentation(): Promise<import("../gas/util/links").DriveLink[]> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: import("../gas/util/links").DriveLink[]) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .harvestLinksFromActivePresentation();
      });
    },

     copyLinksInPresentation(presentationId: string, targetFolderId: string, linksToCopy?: import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/util/links").LinkToCopy[], actionForUnknown?: "move" | "copy" | "ignore"): Promise<import("../gas/util/links").CopyResult[]> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: import("../gas/util/links").CopyResult[]) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .copyLinksInPresentation(presentationId, targetFolderId, linksToCopy, actionForUnknown);
      });
    },

     getActivePresentation(): Promise<import("../gas/slides/slidesAddOn").Document> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: import("../gas/slides/slidesAddOn").Document) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .getActivePresentation();
      });
    },

     getActiveUserEmail(): Promise<string> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: string) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .getActiveUserEmail();
      });
    },

     getFunctionStatus(fname: string): Promise<import("../../../gas-long-process-poller/dist/status").ProcessUpdate> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: import("../../../gas-long-process-poller/dist/status").ProcessUpdate) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .getFunctionStatus(fname);
      });
    },

     getAddOnEnvironment(): Promise<"Slides" | "Docs" | "Sheets" | "Unknown"> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: "Slides" | "Docs" | "Sheets" | "Unknown") => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .getAddOnEnvironment();
      });
    },

     createFolderForDocument(id: string, name: string, parentId?: string): Promise<import("../gas/copier").Folder> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: import("../gas/copier").Folder) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .createFolderForDocument(id, name, parentId);
      });
    },

     getFolderForDocument(id: string): Promise<import("../gas/copier").Folder> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: import("../gas/copier").Folder) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .getFolderForDocument(id);
      });
    },

     setFolderForDocument(id: any, folderId: any): Promise<void> {
      return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((result: void) => resolve(result))
          .withFailureHandler((error: any) => reject(error))
          .setFolderForDocument(id, folderId);
      });
    }
}
