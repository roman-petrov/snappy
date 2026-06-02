import { _ } from "@snappy/core";
import { RouterProvider } from "react-router-dom";

import type { useAppState } from "./App.state";

import styles from "./App.module.scss";

export type AppViewProps = ReturnType<typeof useAppState>;

export const AppView = ({ children, disableSelection, locale, router }: AppViewProps) => (
  <div className={_.cn(styles.viewport, disableSelection && styles.disableSelection)} key={locale}>
    {router === undefined ? children : <RouterProvider router={router} />}
  </div>
);
