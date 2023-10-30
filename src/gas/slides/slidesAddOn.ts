import type { AddOnInterface } from "../addOn";

export const slidesAddOn: AddOnInterface = {
  initUi() {
    return SlidesApp.getUi();
  },
  addToMenu(menu: GoogleAppsScript.Base.Menu) {
    menu.addItem("test harvest", "harvestLinksFromActivePresentation");
  },
};
