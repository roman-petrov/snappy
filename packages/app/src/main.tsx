/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { startApp } from "@snappy/ui";

import { api } from "./core";
import { Router } from "./Router";
import { $loggedIn } from "./Store";
import "./styles.scss";

try {
  await api.checkAuth();
  $loggedIn.set(true);
} catch {
  $loggedIn.set(false);
}
await startApp(`#app-root`, Router, { base: `/app`, disableTextSelection: true });
