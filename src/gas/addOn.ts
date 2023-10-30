export interface AddOnInterface {
  initUi: () => GoogleAppsScript.Base.Ui;
  addToMenu: (menu: GoogleAppsScript.Base.Menu) => void;
}

export interface UniversalMenuInterface {
  addToMenu: (menu: GoogleAppsScript.Base.Menu) => void;
}

import { slidesAddOn } from "./slides/slidesAddOn";
const universalMenu: UniversalMenuInterface = {
  addToMenu(menu: GoogleAppsScript.Base.Menu) {
    menu.addItem("About", "showAbout");
  },
};

export function onOpen(e: any): void {
  // Call all registered AddOn onOpen methods...
  let ui: GoogleAppsScript.Base.Ui;
  let menu: GoogleAppsScript.Base.Menu;
  let specificAddOn: AddOnInterface;
  if (typeof SlidesApp !== "undefined" && SlidesApp.getUi()) {
    specificAddOn = slidesAddOn;
  }
  if (specificAddOn) {
    ui = specificAddOn.initUi();
    let menu = ui.createAddonMenu();
    specificAddOn.addToMenu(menu);
    universalMenu.addToMenu(menu);
    menu.addToUi();
  }
}

export function onInstall(e) {
  // Call all registered AddOn onInstall methods
}
