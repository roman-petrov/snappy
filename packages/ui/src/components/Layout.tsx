import type { ReactNode } from "react";

import { ContextMenuHost } from "./context-menu";
import { Header } from "./Header";
import styles from "./Layout.module.scss";
import { SafeArea } from "./SafeArea";

export type LayoutProps = { content: ReactNode; header: ReactNode };

export const Layout = ({ content, header }: LayoutProps) => (
  <ContextMenuHost>
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        <header className={styles.mobileHeader}>
          <Header>{header}</Header>
        </header>
        <div className={styles.desktopHeader}>
          <Header>{header}</Header>
        </div>
        <SafeArea bottom cn={styles.mainSafe} left right>
          <main className={styles.main}>{content}</main>
        </SafeArea>
      </div>
    </div>
  </ContextMenuHost>
);
