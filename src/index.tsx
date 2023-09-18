/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
import { App } from "./app";
import { ComingSoon } from "./coming-soon";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

if (import.meta.env.VITE_IS_COMING_SOON) {
  render(() => <ComingSoon />, root!);
} else {
  render(() => <App />, root!);
}
