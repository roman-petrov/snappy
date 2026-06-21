/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { HeaderContent } from "./components";
import { Routes } from "./Routes";
import { $signedIn } from "./Store";

startApp({
  base: `/admin`,
  header: <HeaderContent />,
  layerOf: pattern => (pattern === `/` || pattern === `users` ? undefined : pattern === `login` ? `flip` : `cover`),
  routes: Routes,
  signedIn: $signedIn,
});
