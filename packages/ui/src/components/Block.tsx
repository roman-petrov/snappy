import type { ReactNode } from "react";

import styles from "./Block.module.css";

export type BlockProps = {
  as?: `div` | `dl`;
  description: string;
  title: string;
  titleTag?: `h2` | `h3`;
  withDivider?: boolean;
};

export const Block = ({ as = `div`, description, title, titleTag: Tag = `h3`, withDivider = false }: BlockProps) =>
  as === `dl` ? (
    <>
      <dt className={styles.title}>{title}</dt>
      <dd className={withDivider ? `${styles.desc} ${styles.descDivider}` : styles.desc}>{description}</dd>
    </>
  ) : (
    <>
      <Tag className={styles.title}>{title}</Tag>
      <p className={styles.desc}>{description}</p>
    </>
  );

export type DlProps = { children: ReactNode; cn?: string };

export const Dl = ({ children, cn = `` }: DlProps) => (
  <dl className={cn ? `${styles.list} ${cn}`.trim() : styles.list}>{children}</dl>
);
