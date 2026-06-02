import type { usePageState } from "./Page.state";

import { t } from "../locales";
import { IconButton } from "./IconButton";
import styles from "./Page.module.scss";
import { Title } from "./Title";

export type PageViewProps = ReturnType<typeof usePageState>;

export const PageView = ({ back, children, goBack, title }: PageViewProps) => (
  <section className={styles.section}>
    {back || title !== undefined ? (
      <div className={styles.head}>
        {back ? <IconButton icon="arrow_back" onClick={goBack} tip={t(`page.back`)} /> : undefined}
        {title === undefined ? undefined : <Title cn={styles.title} level={1} title={title} />}
      </div>
    ) : undefined}
    {children}
  </section>
);
