import type { ReactNode } from "react";

import { Text } from "@snappy/ui";

import styles from "./Headline.module.scss";

export type HeadlineProps = {
  as?: `h1` | `h2`;
  children: ReactNode;
  lead: string;
  title: string;
  variant?: `hero` | `section`;
};

export const Headline = ({ as = `h2`, children, lead, title, variant = `section` }: HeadlineProps) => (
  <section className={`${styles.root} ${variant === `hero` ? styles.hero : styles.section}`}>
    <Text as={as} text={title} typography={variant === `hero` ? `display` : `h2`} />
    <Text cn={styles.lead} text={lead} typography="large" />
    <div className={styles.cta}>{children}</div>
  </section>
);
