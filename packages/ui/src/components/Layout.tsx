import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Bridge } from "@snappy/platform";

import { ContextMenuHost } from "./context-menu";
import styles from "./Layout.module.scss";
import { Logo } from "./Logo";
import { SafeArea } from "./SafeArea";

export type LayoutProps = { content: ReactNode; header: ReactNode };

export const Layout = ({ content, header }: LayoutProps) => (
  <ContextMenuHost>
    <div className={_.cn(styles.wrap, Bridge.available && styles.wrapApp)}>
      <header className={styles.header}>
        <SafeArea top>
          <div className={styles.headerInner}>
            <Logo />
            <div className={styles.headerTrailing}>{header}</div>
          </div>
        </SafeArea>
      </header>
      <SafeArea bottom cn={styles.mainSafe} left right>
        <main className={styles.main}>{content}</main>
      </SafeArea>
    </div>
  </ContextMenuHost>
);
