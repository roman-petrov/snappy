import { IconButton, Title } from "@snappy/ui";

import type { usePageState } from "./Page.state";

import styles from "./Page.module.scss";

export type PageViewProps = ReturnType<typeof usePageState>;

export const PageView = ({ back, children, goBack, title }: PageViewProps) => (
  <section className={styles.section}>
    {back || title !== undefined ? (
      <div className={styles.head}>
        {back ? <IconButton icon={{ emoji: `←` }} onClick={goBack} tip="Back" /> : undefined}
        {title === undefined ? undefined : <Title cn={styles.title} level={1} title={title} />}
      </div>
    ) : undefined}
    {children}
  </section>
);
