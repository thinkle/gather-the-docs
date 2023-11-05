/* Set up a mock for the little sidebar window and/or dialog
  so it looks vaguely like a real add-on when testing in 
  a local browser.
*/
import { DEFAULT_CONTEXT } from "../context";

export function setContext(context = {}) {
  Object.assign(DEFAULT_CONTEXT, context);
  let main = document.querySelector("main");
  main?.setAttribute("class", "");
  if (main) main.classList.add(DEFAULT_CONTEXT.addOn);
  let div = document.querySelector("div");
  div?.setAttribute("class", "");
  if (div) {
    div.classList.add(DEFAULT_CONTEXT.container);
    if (DEFAULT_CONTEXT.mode) {
      div.classList.add(DEFAULT_CONTEXT.mode);
    }
  }

  document.querySelector(".app").textContent = DEFAULT_CONTEXT.addOn;
}

setContext();

let sideButton = document.querySelector("#sidebar");
let dialogButton = document.querySelector("#dialog");
if (sideButton) {
  sideButton.addEventListener("click", () => {
    setContext({ container: "sidebar" });
  });
}
if (dialogButton) {
  dialogButton.addEventListener("click", () => {
    setContext({ container: "dialog" });
  });
}
