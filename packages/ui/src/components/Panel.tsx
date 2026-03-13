import type { ReactNode } from "react";

import { Card } from "./Card";
import styles from "./Panel.module.scss";
import { Title } from "./Title";

export type PanelProps = { children: ReactNode; lead?: string; title: string };

export const Panel = ({ children, lead, title }: PanelProps) => (
  <div className={styles.page}>
    <Card>
      <Title as="h1" lead={lead} level={2} title={title} />
      <div className={styles.content}>{children}</div>
    </Card>
  </div>
);
