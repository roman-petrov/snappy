import type { ReactNode } from "react";

import styles from "./Headline.module.css";
import { Text } from "./Text";

export type HeadlineProps = {
  as?: `h1` | `h2`;
  children: ReactNode;
  lead: string;
  title: string;
  variant?: `hero` | `section`;
};

export const Headline = ({ as = `h2`, children, lead, title, variant = `section` }: HeadlineProps) => {
  const rootClass = variant === `hero` ? styles.hero : styles.section;

  return (
    <section className={`${styles.root} ${rootClass}`}>
      <Text as={as} variant={variant === `hero` ? `display` : `h2`}>
        {title}
      </Text>
      <Text cn={styles.lead} variant="large">
        {lead}
      </Text>
      <div className={styles.cta}>{children}</div>
    </section>
  );
};
