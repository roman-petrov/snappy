import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { PageNarrow, Text } from "@snappy/ui";

import styles from "./PromoBlock.module.scss";

export type PromoBlockProps = {
  actions: ReactNode;
  as?: `h1` | `h2`;
  bordered?: boolean;
  lead: string;
  note?: string;
  title: string;
  titleTypography: `display` | `h2`;
};

export const PromoBlock = ({
  actions,
  as = `h2`,
  bordered = false,
  lead,
  note,
  title,
  titleTypography,
}: PromoBlockProps) => (
  <section className={_.cn(styles.root, bordered && styles.bordered)}>
    <Text as={as} cn={styles.title} text={title} typography={titleTypography} />
    <PageNarrow>
      <Text text={lead} typography="large" />
    </PageNarrow>
    <div className={styles.actions}>{actions}</div>
    {note === undefined ? undefined : <Text cn={styles.note} text={note} typography="caption" />}
  </section>
);
