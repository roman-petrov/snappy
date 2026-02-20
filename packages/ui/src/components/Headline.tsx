import type { ReactNode } from "react";

import styles from "./Headline.module.css";

export type HeadlineProps = {
  as?: `h1` | `h2`;
  children: ReactNode;
  lead: string;
  title: string;
  variant?: `hero` | `section`;
};

export const Headline = ({ as: Tag = `h2`, children, lead, title, variant = `section` }: HeadlineProps) => {
  const rootClass = variant === `hero` ? styles.hero : styles.section;

  return (
    <section className={`${styles.root} ${rootClass}`}>
      <Tag className={styles.title}>{title}</Tag>
      <p className={styles.lead}>{lead}</p>
      <div className={styles.cta}>{children}</div>
    </section>
  );
};
