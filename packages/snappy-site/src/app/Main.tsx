/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */

import { Browser } from "@snappy/browser";
import { startApp } from "@snappy/ui";

import { api } from "./core";
import { DesktopApp } from "./desktop/App";
import { MobileApp } from "./mobile/App";
import { $loggedIn } from "./Store";

try {
  await api.checkAuth();
  $loggedIn.set(true);
} catch {
  $loggedIn.set(false);
}

const root = document.querySelector(`#app-root`);
if (root instanceof HTMLElement) {
  startApp(root, Browser.mobile ? <MobileApp /> : <DesktopApp />);
}
