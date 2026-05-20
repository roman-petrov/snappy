import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Text } from "@snappy/ui";

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
    <Text cn={styles.lead} text={lead} typography="large" />
    <div className={styles.actions}>{actions}</div>
  </section>
);
