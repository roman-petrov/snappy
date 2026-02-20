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
      <Text as="dt" cn={styles.title} variant="h3">
        {title}
      </Text>
      <Text
        as="dd"
        cn={withDivider ? styles.descDivider : undefined}
        variant="large"
      >
        {description}
      </Text>
    </>
  ) : (
    <>
      <Text as={titleTag} variant="h3">
        {title}
      </Text>
      <Text variant="large">{description}</Text>
    </>
  );

export type DlProps = { children: ReactNode; cn?: string };

export const Dl = ({ children, cn = `` }: DlProps) => (
  <dl className={cn ? `${styles.list} ${cn}`.trim() : styles.list}>{children}</dl>
);
