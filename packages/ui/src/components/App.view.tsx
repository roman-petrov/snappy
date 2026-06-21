import { RouteStage, SafeArea } from "@snappy/app-router";
import { _ } from "@snappy/core";

import type { useAppState } from "./App.state";

import styles from "./App.module.scss";
import { AppHeaderContext } from "./AppHeaderContext";
import { ContextMenuHost } from "./context-menu";

export type AppViewProps = ReturnType<typeof useAppState>;

export const AppView = ({ children, content, disableSelection, header, locale, track }: AppViewProps) => (
  <AppHeaderContext value={header}>
    <ContextMenuHost>
      <div className={_.cn(styles.viewport, disableSelection && styles.disableSelection)} key={locale}>
        <div className={styles.wrap}>
          <SafeArea cn={styles.mainSafe} left right>
            <RouteStage content={content} track={track}>
              {children}
            </RouteStage>
          </SafeArea>
        </div>
      </div>
    </ContextMenuHost>
  </AppHeaderContext>
);
