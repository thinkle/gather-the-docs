import { DriveLink, getDriveLinks, Metadata, type Link } from "../util";
import { SlidesType } from "../util/";

export function harvestLinksFromActivePresentation() {
  let pres = SlidesApp.getActivePresentation();
  let links: DriveLink[] = [];
  pres.getSlides().forEach((slide, idx) => {
    links = [...links, ...crawlSlideForLinks(slide, idx, pres)];
  });
  return links;
}

function crawlSlideForLinks(
  slide: GoogleAppsScript.Slides.Slide,
  index: number,
  p: GoogleAppsScript.Slides.Presentation
): DriveLink[] {
  let allTheLinks: DriveLink[] = [];
  slide.getPageElements().forEach((el) => {
    let metadata: Metadata = {
      page: index,
      originMimetype: SlidesType,
      originId: p.getId(),
      text: "",
    };

    let elLinks: Link[] = [];

    if (el.getPageElementType() === SlidesApp.PageElementType.SHAPE) {
      let shape = el.asShape();
      try {
        var textRange = shape.getText();
      } catch (e) {
        console.log("Unable to get text from shape", shape);
        return;
      }
      extractLinksFromTextRange(textRange).forEach(({ url, text }) => {
        elLinks.push({
          url: url,
          metadata: { ...metadata, text },
        });
      });
    } else if (el.getPageElementType() === SlidesApp.PageElementType.TABLE) {
      let table = el.asTable();
      for (let row = 0; row < table.getNumRows(); row++) {
        for (let col = 0; col < table.getNumColumns(); col++) {
          let cell = table.getCell(row, col);
          try {
            var textRange = cell.getText();
          } catch (e) {
            console.log("Unable to get text from cell", cell, e);
            return;
          }
          extractLinksFromTextRange(textRange).forEach(({ url, text }) => {
            elLinks.push({
              url: url,
              metadata: { ...metadata, text },
            });
          });
        }
      }
    } else {
      console.log("Unable to handle type", el.getPageElementType().toString());
    }
    // Add more element types if necessary...
    allTheLinks = [...allTheLinks, ...getDriveLinks(elLinks)];
  });

  return allTheLinks;
}

function extractLinksFromTextRange(
  textRange: GoogleAppsScript.Slides.TextRange
): { url: string; text: string }[] {
  let links: { url: string; text: string }[] = [];
  let linkRanges = textRange.getLinks();
  for (let l of linkRanges) {
    let url = l.getTextStyle().getLink().getUrl();
    let text = l.asRenderedString();
    links.push({ url, text });
  }

  return links;
}
