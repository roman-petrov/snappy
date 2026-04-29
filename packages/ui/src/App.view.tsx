import { _ } from "@snappy/core";

import type { useAppState } from "./App.state";

import styles from "./App.module.scss";

export type AppViewProps = ReturnType<typeof useAppState>;

export const AppView = ({ children, disableLinkSelection, disableTextSelection, locale }: AppViewProps) => (
  <div
    className={_.cn(
      styles.viewport,
      disableTextSelection && styles.disableTextSelection,
      disableLinkSelection && styles.disableLinkSelection,
    )}
    key={locale}
  >
    {children}
  </div>
);
