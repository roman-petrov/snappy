import { _ } from "@snappy/core";
import { Bridge } from "@snappy/platform";
import { type ReactNode, useState } from "react";

import { ContextMenuHost } from "./context-menu";
import { DefaultHeader } from "./DefaultHeader";
import styles from "./Layout.module.scss";
import { LayoutHeaderContext } from "./LayoutHeaderContext";
import { SafeArea } from "./SafeArea";
import { SystemButtons } from "./SystemButtons";

export type LayoutProps = { content: ReactNode; trailing?: ReactNode };

export const Layout = ({ content, trailing }: LayoutProps) => {
  const [pageHeader, setPageHeader] = useState<ReactNode>();
  const header = pageHeader ?? <DefaultHeader trailing={trailing ?? <SystemButtons />} />;

  return (
    <LayoutHeaderContext.Provider value={setPageHeader}>
      <ContextMenuHost>
        <div className={_.cn(styles.wrap, Bridge.available && styles.wrapApp)}>
          <header className={styles.header}>{header}</header>
          <SafeArea bottom cn={styles.mainSafe} left right>
            <main className={styles.main}>{content}</main>
          </SafeArea>
        </div>
      </ContextMenuHost>
    </LayoutHeaderContext.Provider>
  );
};
