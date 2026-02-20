import type { ReactNode } from "react";

import styles from "./Title.module.css";

export type TitleProps = { as?: `h1` | `h2`; children: ReactNode; cn?: string; lead?: string; level?: 1 | 2 };

export const Title = ({ as: Tag = `h1`, children, cn = ``, lead, level = 2 }: TitleProps) => (
  <>
    <Tag className={`${styles.root} ${level === 1 ? styles.level1 : styles.level2} ${cn}`.trim()}>{children}</Tag>
    {lead !== undefined && <p className={styles.lead}>{lead}</p>}
  </>
);
