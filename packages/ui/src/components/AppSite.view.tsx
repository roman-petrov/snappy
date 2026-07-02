import { SafeArea } from "@snappy/app-router";

import type { useAppSiteState } from "./AppSite.state";

import { AppHeaderContext } from "./AppHeaderContext";
import styles from "./AppSite.module.scss";
import { ContextMenuHost } from "./context-menu";

export type AppSiteViewProps = ReturnType<typeof useAppSiteState>;

export const AppSiteView = ({ children, header, locale }: AppSiteViewProps) => (
  <AppHeaderContext value={header}>
    <ContextMenuHost>
      <div className={styles.viewport} key={locale}>
        <SafeArea cn={styles.main} left right>
          {children}
        </SafeArea>
      </div>
    </ContextMenuHost>
  </AppHeaderContext>
);
