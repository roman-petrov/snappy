import { _ } from "@snappy/core";
import { $, Card, type CardProps } from "@snappy/ui";

import styles from "./SettingsCard.module.scss";

export type SettingsCardProps = CardProps & { form?: boolean; lead?: string; title?: string };

export const SettingsCard = ({ children, cn, form = false, lead, title, ...props }: SettingsCardProps) => (
  <Card {...props} cn={_.cn(styles.block, form && styles.form, cn)}>
    {title !== undefined && <h2 className={$.typography(`bodyBold`)}>{title}</h2>}
    {lead !== undefined && <p className={$.typography(`bodySm`)}>{lead}</p>}
    {children}
  </Card>
);
