import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Card, type CardProps, Text } from "@snappy/ui";

import styles from "./SettingsCard.module.scss";

export type SettingsCardProps = CardProps & { form?: boolean; lead?: string; title?: ReactNode };

export const SettingsCard = ({ children, cn, form = false, lead, title, ...props }: SettingsCardProps) => {
  const hasHeader = title !== undefined || lead !== undefined;

  return (
    <Card {...props} cn={_.cn(styles.block, hasHeader && styles.withHeader, form && styles.form, cn)}>
      {hasHeader ? (
        <div className={styles.header}>
          {title === undefined ? undefined : _.isString(title) ? <Text text={title} typography="bodyBold" /> : title}
          {lead === undefined ? undefined : <Text text={lead} typography="bodySm" />}
        </div>
      ) : undefined}
      {children}
    </Card>
  );
};
