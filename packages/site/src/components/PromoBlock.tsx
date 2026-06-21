import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { PageNarrow, Text } from "@snappy/ui";

import styles from "./PromoBlock.module.scss";

export type PromoBlockProps = {
  actions: ReactNode;
  bordered?: boolean;
  lead: string;
  title: string;
  titleTypography: `display` | `h2`;
};

export const PromoBlock = ({ actions, bordered = false, lead, title, titleTypography }: PromoBlockProps) => (
  <section className={_.cn(styles.root, bordered && styles.bordered)}>
    <Text text={title} typography={titleTypography} />
    <PageNarrow>
      <Text text={lead} typography="large" />
    </PageNarrow>
    <div className={styles.actions}>{actions}</div>
  </section>
);
