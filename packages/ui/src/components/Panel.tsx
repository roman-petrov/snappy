import type { ReactNode } from "react";

import { Card } from "./Card";
import styles from "./Panel.module.css";
import { Title } from "./Title";

export type PanelProps = { children: ReactNode; lead?: string; title: string };

export const Panel = ({ children, lead, title }: PanelProps) => (
  <div className={styles.page}>
    <Card>
      <Title as="h1" lead={lead} level={2} title={title} />
      {children}
    </Card>
  </div>
);
