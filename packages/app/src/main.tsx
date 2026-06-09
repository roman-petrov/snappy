/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { AppBase } from "./AppBase";
import { HeaderContent } from "./components";
import { Routes } from "./Routes";
import { $signedIn } from "./Store";

startApp({ base: AppBase.url(``), header: <HeaderContent />, routes: Routes, signedIn: $signedIn });
