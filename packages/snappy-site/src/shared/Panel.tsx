import type { ReactNode } from "react";

import { Card } from "./Card";
import styles from "./Panel.module.css";

export type PanelProps = { children: ReactNode; lead?: string; title: string };

export const Panel = ({ children, lead, title }: PanelProps) => (
  <div className={styles[`page`]}>
    <Card>
      <h1 className={styles[`title`]}>{title}</h1>
      {lead !== undefined && <p className={styles[`lead`]}>{lead}</p>}
      {children}
    </Card>
  </div>
);
