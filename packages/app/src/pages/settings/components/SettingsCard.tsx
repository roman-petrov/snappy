import { _ } from "@snappy/core";
import { $, Card, type CardProps } from "@snappy/ui";

import styles from "./SettingsCard.module.scss";

export type SettingsCardProps = CardProps & { form?: boolean; lead?: string; title?: string };

export const SettingsCard = ({ children, cn, form = false, lead, title, ...props }: SettingsCardProps) => (
  <Card
    {...props}
    cn={_.cn(
      styles.block,
      (title !== undefined || lead !== undefined) && styles.withHeader,
      title === undefined && lead === undefined && !form && styles.compact,
      form && styles.form,
      cn,
    )}
  >
    {title !== undefined && <h2 className={_.cn($.typography(`bodyBold`), styles.header)}>{title}</h2>}
    {lead !== undefined && <p className={_.cn($.typography(`bodySm`), styles.header)}>{lead}</p>}
    {children}
  </Card>
);
