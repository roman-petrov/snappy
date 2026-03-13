/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import { effect } from "@preact/signals";
import { $theme, AndroidBridge, startApp } from "@snappy/ui";
import { Route } from "wouter";

import { api } from "./core";
import { Layout } from "./Layout";
import { $loggedIn } from "./Store";
import "./styles.scss";

effect(() => AndroidBridge.setBarStyle($theme.value));

try {
  await api.checkAuth();
  $loggedIn.value = true;
} catch {
  $loggedIn.value = false;
}
startApp(
  `#app-root`,
  <Route nest path="/">
    <Layout />
  </Route>,
  { base: `/app`, disableTextSelection: true },
);
