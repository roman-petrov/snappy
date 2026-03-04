/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { Landing } from "./components";

const root = document.querySelector(`#root`);
if (root instanceof HTMLElement) {
  startApp(root, <Landing />, { server: true });
}
