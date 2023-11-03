export type Folder = {
  name: string;
  id: string;
};

export function copyFile(id: string, targetFolderId: string) {
  let targetFolder = DriveApp.getFolderById(targetFolderId);
  let cacheProperty = `${id}-${targetFolder.getId()}}`;
  let cachedCopyId =
    PropertiesService.getUserProperties().getProperty(cacheProperty);
  if (cachedCopyId) {
    return DriveApp.getFileById(cachedCopyId);
  } else {
    let file = DriveApp.getFileById(id);
    let copy = file.makeCopy(targetFolder);
    PropertiesService.getUserProperties().setProperty(
      cacheProperty,
      copy.getId()
    );
    return copy;
  }
}

export function setFolderForDocument(id, folderId) {
  let prop = `folder-for-${id}`;
  PropertiesService.getUserProperties().setProperty(prop, folderId);
}

export function createFolderForDocument(
  id: string,
  name: string,
  parentId: string | null = null
): Folder {
  let document = DriveApp.getFileById(id);
  let parent =
    (parentId && DriveApp.getFolderById(parentId)) ||
    document.getParents().next();
  let folder = parent.createFolder(name);
  setFolderForDocument(id, folder.getId());
  return {
    id: folder.getId(),
    name: folder.getName(),
  };
}

export function getFolderForDocument(id: string): Folder {
  let prop = `folder-for-${id}`;
  let existingFolderId =
    PropertiesService.getUserProperties().getProperty(prop);
  if (existingFolderId) {
    try {
      var folder = DriveApp.getFolderById(existingFolderId);
    } catch (err) {
      console.log("Unable to access folder", existingFolderId);
      return null;
    }
    let name = folder.getName();
    return {
      id: existingFolderId,
      name,
    };
  } else {
    return null;
  }
}
export function getActiveUserEmail() {
  const user = Session.getActiveUser();
  return user.getEmail();
}
