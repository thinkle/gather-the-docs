import "./app.css";
import App from "./App.svelte";
import * as mockApi from "./mock/mockApi";
import { GoogleMock } from "google-apps-script-run-ts-mocks";

let app;
if (process.env.NODE_ENV === "development") {
  const VERBOSE = true;
  console.log("Running in development mode, verbose=", VERBOSE);
  globalThis.google = new GoogleMock(mockApi, VERBOSE);
}
app = new App({
  target: document.getElementById("app"),
});

export default app;
