
declare namespace google.script {  
  interface GoogleScriptRun {
      withFailureHandler(callback: (error: Error, object?: any) => void): this;
      withSuccessHandler(callback: (value: any, object?: any) => void): this;
      withUserObject(object: Object): this;
      getOAuthToken(): void;
  getApiKey(): void;
  onPickerCancel(): void;
  onPickerComplete(id: string): void;
  pickFolder(filetype?: "folder", title?: string): void;
  getFolderInfo(folderId: string): void;
  harvestLinksFromActivePresentation(): void;
  copyLinksInPresentation(presentationId: string, targetFolderId: string, linksToCopy?: import("/Users/thinkle/BackedUpProjects/gas/gather-the-docs/src/gas/util/links").LinkToCopy[], actionForUnknown?: "move" | "copy" | "ignore"): void;
  getActivePresentation(): void;
  getActiveUserEmail(): void;
  getFunctionStatus(fname: string): void;
  getAddOnEnvironment(): void;
  createFolderForDocument(id: string, name: string, parentId?: string): void;
  getFolderForDocument(id: string): void;
  setFolderForDocument(id: any, folderId: any): void
  }
  const run : GoogleScriptRun;

  interface GoogleScriptHost {
  close(): void;
  setHeight(height: number): void;
  setWidth(width: number): void;
  editor: {
    focus(): void;
  };
}
const host : GoogleScriptHost;
  

  interface IUrlLocation {
  hash: string;
  parameter: { [key: string]: any };
  parameters: { [key: string]: any[] };
}

interface GoogleScriptUrl {
  getLocation(callback: (location: IUrlLocation) => void): void;
}
const url : GoogleScriptUrl;
  
}
