import { _ } from "@snappy/core";
import { $, Card, type CardProps } from "@snappy/ui";

import styles from "./SettingsCard.module.scss";

export type SettingsCardProps = CardProps & { error?: string; lead?: string; title?: string };

export const SettingsCard = ({ children, cn, error, lead, title, ...props }: SettingsCardProps) => (
  <Card {...props} cn={_.cn(styles.block, cn)}>
    {title !== undefined && <h2 className={$.typography(`bodyBold`)}>{title}</h2>}
    {lead !== undefined && <p className={$.typography(`bodySm`)}>{lead}</p>}
    {children}
    {error !== undefined && error !== `` && <p className={_.cn($.typography(`caption`), $.color(`error`))}>{error}</p>}
  </Card>
);
