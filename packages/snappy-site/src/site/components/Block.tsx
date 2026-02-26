import type { ReactNode } from "react";

import { Text } from "@snappy/ui";

import styles from "./Block.module.css";

export type BlockProps = {
  as?: `div` | `dl`;
  description: string;
  icon?: string;
  title: string;
  titleTag?: `h2` | `h3`;
  withDivider?: boolean;
};

export const Block = ({ as = `div`, description, icon, title, titleTag = `h3`, withDivider = false }: BlockProps) =>
  as === `dl` && icon !== undefined ? (
    <div className={withDivider ? [styles.row, styles.rowWithIcon].join(` `) : styles.rowWithIcon}>
      <span aria-hidden className={styles.icon}>
        {icon}
      </span>
      <Text as="dt" color="heading" text={title} typography="h3" />
      <Text as="dd" color="muted" text={description} typography="large" />
    </div>
  ) : as === `dl` ? (
    <>
      <Text as="dt" color="heading" text={title} typography="h3" />
      <Text as="dd" cn={withDivider ? styles.row : undefined} color="muted" text={description} typography="large" />
    </>
  ) : (
    <>
      <Text as={titleTag} color="heading" text={title} typography="h3" />
      <Text color="muted" text={description} typography="large" />
    </>
  );

export type DlProps = { children: ReactNode };

export const Dl = ({ children }: DlProps) => <dl className={styles.list}>{children}</dl>;
