/* eslint-disable functional/no-expression-statements */

import { startApp } from "@snappy/ui";

import { Auth } from "./core";
import { Router } from "./Router";
import { $loggedIn } from "./Store";
import "./styles.scss";

$loggedIn.set(await Auth.loggedIn());
await startApp(`#app-root`, Router, { base: `/app`, disableTextSelection: true });
