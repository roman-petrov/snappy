import type { ReactNode } from "react";

import { Text } from "@snappy/ui";

import styles from "./Block.module.scss";

export type BlockProps = { description: string; icon?: string; title: string; withDivider?: boolean };

export const Block = ({ description, icon, title, withDivider = false }: BlockProps) =>
  icon === undefined ? (
    <>
      <Text as="dt" color="heading" text={title} typography="h3" />
      <Text as="dd" cn={withDivider ? styles.row : undefined} color="muted" text={description} typography="large" />
    </>
  ) : (
    <div className={withDivider ? [styles.row, styles.rowWithIcon].join(` `) : styles.rowWithIcon}>
      <span aria-hidden className={styles.icon}>
        {icon}
      </span>
      <Text as="dt" color="heading" text={title} typography="h3" />
      <Text as="dd" color="muted" text={description} typography="large" />
    </div>
  );

export type DlProps = { children: ReactNode };

export const Dl = ({ children }: DlProps) => <dl className={styles.list}>{children}</dl>;
