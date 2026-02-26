import type { ReactNode } from "react";

import styles from "./Block.module.css";
import { Text } from "./Text";

export type BlockProps = {
  as?: `div` | `dl`;
  description: string;
  title: string;
  titleTag?: `h2` | `h3`;
  withDivider?: boolean;
};

export const Block = ({ as = `div`, description, title, titleTag = `h3`, withDivider = false }: BlockProps) =>
  as === `dl` ? (
    <>
      <Text as="dt" color="heading" text={title} typography="h3" />
      <Text
        as="dd"
        cn={withDivider ? styles.descDivider : undefined}
        color="muted"
        text={description}
        typography="large"
      />
    </>
  ) : (
    <>
      <Text as={titleTag} color="heading" text={title} typography="h3" />
      <Text color="muted" text={description} typography="large" />
    </>
  );

export type DlProps = { children: ReactNode; cn?: string };

export const Dl = ({ children, cn = `` }: DlProps) => (
  <dl className={cn ? `${styles.list} ${cn}`.trim() : styles.list}>{children}</dl>
);
