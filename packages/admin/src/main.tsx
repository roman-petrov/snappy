/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { HeaderContent } from "./components";
import { Routes } from "./Routes";
import { $signedIn } from "./Store";

startApp({ base: `/admin`, header: <HeaderContent />, routes: Routes, signedIn: $signedIn });
