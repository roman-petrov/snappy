import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Card, type CardProps, Text } from "@snappy/ui";

import styles from "./SettingsCard.module.scss";

export type SettingsCardProps = CardProps & { form?: boolean; lead?: string; title?: ReactNode };

export const SettingsCard = ({ children, cn, form = false, lead, title, ...props }: SettingsCardProps) => (
  <Card
    {...props}
    cn={_.cn(styles.block, (title !== undefined || lead !== undefined) && styles.withHeader, form && styles.form, cn)}
  >
    {title !== undefined &&
      (_.isString(title) ? (
        <Text cn={styles.header} text={title} typography="bodyBold" />
      ) : (
        <div className={styles.header}>{title}</div>
      ))}
    {lead !== undefined && <Text cn={styles.header} text={lead} typography="bodySm" />}
    {children}
  </Card>
);
