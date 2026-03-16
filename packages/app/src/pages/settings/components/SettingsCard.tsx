import type { ReactNode } from "react";

import { Card } from "@snappy/ui";

import styles from "./SettingsCard.module.scss";

export type SettingsCardProps = { children: ReactNode; error?: string; lead?: string; title?: string };

export const SettingsCard = ({ children, error, lead, title }: SettingsCardProps) => (
  <Card cn={styles.block}>
    {title !== undefined && <h2 className={styles.blockTitle}>{title}</h2>}
    {lead !== undefined && <p className={styles.blockLead}>{lead}</p>}
    {children}
    {error !== undefined && error !== `` && <p className={styles.error}>{error}</p>}
  </Card>
);
