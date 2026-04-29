import type { ReactNode } from "react";

import { Icon, Text } from "@snappy/ui";

import styles from "./Block.module.scss";

export type BlockProps = { description: string; icon?: string; title: string };

export const Block = ({ description, icon, title }: BlockProps) =>
  icon === undefined ? (
    <>
      <Text as="dt" text={title} typography="h3" />
      <Text as="dd" text={description} typography="large" />
    </>
  ) : (
    <div className={styles.rowWithIcon}>
      <Icon cn={styles.icon} name={{ emoji: icon }} size="lg" />
      <Text as="dt" text={title} typography="h3" />
      <Text as="dd" text={description} typography="large" />
    </div>
  );

export type DlProps = { children: ReactNode };

export const Dl = ({ children }: DlProps) => <dl className={styles.list}>{children}</dl>;
