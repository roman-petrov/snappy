import { ContentColumn, SafeArea } from "@snappy/app-router";
import { _ } from "@snappy/core";

import type { usePageState } from "./Page.state";

import { Logo } from "./Logo";
import styles from "./Page.module.scss";
import { PageHeader } from "./PageHeader";

export type PageViewProps = ReturnType<typeof usePageState>;

export const PageView = ({ back, children, customHeader, fill, showLogo, tab, title, trailing }: PageViewProps) => (
  <div className={_.cn(styles.root, fill && styles.rootFill, tab && styles.rootTab)}>
    <header className={styles.header}>
      <SafeArea top>
        <ContentColumn cn={styles.headerInner}>
          <div className={styles.headerSlot}>
            {customHeader ?? (
              <PageHeader back={back} title={title ?? (showLogo ? <Logo /> : undefined)} trailing={trailing} />
            )}
          </div>
        </ContentColumn>
      </SafeArea>
    </header>
    <ContentColumn cn={styles.section}>{children}</ContentColumn>
  </div>
);
