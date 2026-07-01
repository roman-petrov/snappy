/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { HeaderContent } from "./components";
import { $data } from "./data";
import { Routes } from "./Routes";

startApp({
  base: `/admin`,
  header: <HeaderContent />,
  layerOf: pattern => (pattern === `/` || pattern === `users` ? undefined : pattern === `login` ? `flip` : `cover`),
  routes: Routes,
  signedIn: $data.auth.read,
});
