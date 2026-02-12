import type { ReactNode } from "react";

import styles from "./Section.module.css";

interface Props { children: ReactNode; id?: string; lead: string; title: string; }

export const Section = ({ children, id, lead, title }: Props) => (
  <section className={styles[`section`]} id={id}>
    <h2 className={styles[`title`]}>{title}</h2>
    <p className={styles[`lead`]}>{lead}</p>
    {children}
  </section>
);
