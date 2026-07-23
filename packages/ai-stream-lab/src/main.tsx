/* eslint-disable functional/no-expression-statements */
import { Store } from "@snappy/core";
import { IconButtonTheme, startApp } from "@snappy/ui";

import { Routes } from "./Routes";

startApp({ base: ``, header: <IconButtonTheme />, routes: Routes, signedIn: Store(true) });
