import type { useAppState } from "./App.state";

import styles from "./App.module.scss";

export type AppViewProps = ReturnType<typeof useAppState>;

export const AppView = ({ children, disableTextSelection }: AppViewProps) => (
  <div className={disableTextSelection ? styles.disableTextSelection : undefined}>{children}</div>
);
