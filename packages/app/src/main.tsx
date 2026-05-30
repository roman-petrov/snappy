/* eslint-disable functional/no-expression-statements */
import { Shiki } from "@snappy/ai-stream";
import { startApp } from "@snappy/ui";

import { Auth } from "./core";
import { Router } from "./Router";
import { $loggedIn } from "./Store";

$loggedIn.set(await Auth.loggedIn());
await startApp(Router, { base: `/app`, disableLinkSelection: true, disableTextSelection: true });

Shiki.preload();
