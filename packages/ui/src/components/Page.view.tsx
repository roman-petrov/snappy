import type { usePageState } from "./Page.state";

import { Logo } from "./Logo";
import styles from "./Page.module.scss";
import { PageHeader } from "./PageHeader";
import { SafeArea } from "./SafeArea";

export type PageViewProps = ReturnType<typeof usePageState>;

export const PageView = ({ back, children, customHeader, showLogo, title, trailing }: PageViewProps) => (
  <div className={styles.root}>
    <header className={styles.header}>
      <SafeArea top>
        <div className={styles.headerInner}>
          <div className={styles.headerSlot}>
            {customHeader ?? (
              <PageHeader back={back} title={title ?? (showLogo ? <Logo /> : undefined)} trailing={trailing} />
            )}
          </div>
        </div>
      </SafeArea>
    </header>
    <section className={styles.section}>{children}</section>
  </div>
);
