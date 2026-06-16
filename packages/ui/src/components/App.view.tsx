import { _ } from "@snappy/core";

import type { useAppState } from "./App.state";

import styles from "./App.module.scss";
import { AppHeaderContext } from "./AppHeaderContext";
import { ContextMenuHost } from "./context-menu";
import { SafeArea } from "./SafeArea";

export type AppViewProps = ReturnType<typeof useAppState>;

export const AppView = ({ children, disableSelection, header, locale }: AppViewProps) => (
  <AppHeaderContext value={header}>
    <ContextMenuHost>
      <div className={_.cn(styles.viewport, disableSelection && styles.disableSelection)} key={locale}>
        <div className={styles.wrap}>
          <SafeArea cn={styles.mainSafe} left right>
            {children}
          </SafeArea>
        </div>
      </div>
    </ContextMenuHost>
  </AppHeaderContext>
);
