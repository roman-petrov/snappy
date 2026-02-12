import type { ReactNode } from "react";
import styles from "./Section.module.css";

type Props = {
  id?: string;
  title: string;
  lead: string;
  children: ReactNode;
};

export const Section = ({ id, title, lead, children }: Props) => (
  <section id={id} className={styles[`section`]}>
    <h2 className={styles[`title`]}>{title}</h2>
    <p className={styles[`lead`]}>{lead}</p>
    {children}
  </section>
);
