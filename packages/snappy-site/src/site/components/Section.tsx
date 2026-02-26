import type { ReactNode } from "react";

import { Title } from "@snappy/ui";

import styles from "./Section.module.css";

export type SectionProps = { children: ReactNode; id?: string; lead: string; title: string };

export const Section = ({ children, id, lead, title }: SectionProps) => (
  <section className={styles.section} id={id}>
    <Title as="h2" lead={lead} level={1} title={title} />
    {children}
  </section>
);
