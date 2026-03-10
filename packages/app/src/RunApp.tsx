/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { ReactNode } from "react";

import { startApp } from "@snappy/ui";

import { api } from "./core";
import { $loggedIn } from "./Store";

export const runApp = async (component: ReactNode) => {
  try {
    await api.checkAuth();
    $loggedIn.value = true;
  } catch {
    $loggedIn.value = false;
  }
  startApp(`#app-root`, component, { base: `/app`, disableTextSelection: true });
};
