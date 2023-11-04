import "./app.css";
import App from "./App.svelte";
import * as mockApi from "./mock/mockApi";
import { GoogleMock } from "google-apps-script-run-ts-mocks";
import { DEFAULT_CONTEXT } from "./context";
import indexContent from "./index.html?raw";
import mockCss from "./mock/mock.css?raw";

let app;
if (process.env.NODE_ENV === "development") {
  globalThis.google = new GoogleMock(mockApi);
  let iframe = document.createElement("iframe");
  iframe.classList.add(DEFAULT_CONTEXT.container);
  if (DEFAULT_CONTEXT.mode) {
    iframe.classList.add(DEFAULT_CONTEXT.mode);
  }

  // Create a DOMParser instance to parse the indexContent string
  let parser = new DOMParser();
  let doc = parser.parseFromString(indexContent, "text/html");

  // Remove the script tag that imports main.ts
  let scripts = doc.querySelectorAll("script");
  for (let script of scripts) {
    if (script.src.includes("main.ts")) {
      script.remove();
    }
  }

  // Serialize the document back to a string
  let serializer = new XMLSerializer();
  let cleanIndexContent = serializer.serializeToString(doc);

  iframe.onload = () => {
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(cleanIndexContent);
    iframe.contentWindow.document.close();
    app = new App({
      target: iframe.contentDocument.getElementById("app"),
    });
  };

  let main = document.createElement("main");
  main.classList.add(DEFAULT_CONTEXT.addOn);
  document.body.appendChild(main);
  if (DEFAULT_CONTEXT.container == "sidebar") {
    document.body.appendChild(iframe);
  } else {
    let container = document.createElement("div");
    container.classList.add("dialog-container");
    container.appendChild(iframe);
    document.body.appendChild(container);
  }
  let style = document.createElement("style");
  style.textContent = mockCss;
  document.head.appendChild(style);
} else {
  app = new App({
    target: document.getElementById("app"),
  });
}
export default app;
