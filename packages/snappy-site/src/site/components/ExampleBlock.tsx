import type { ReactNode } from "react";

import { Text } from "@snappy/ui";

import styles from "./ExampleBlock.module.css";

export type ExampleBlockProps = {
  after: ReactNode;
  afterLabel: string;
  before: string;
  beforeLabel: string;
  label: string;
};

export const ExampleBlock = ({ after, afterLabel, before, beforeLabel, label }: ExampleBlockProps) => (
  <div className={styles.block}>
    <Text as="p" cn={styles.label} color="accent" variant="captionBold">
      {label}
    </Text>
    <div className={styles.row}>
      <div className={`${styles.panel} ${styles.before}`}>
        <Text as="span" cn={styles.panelTitle} color="error" variant="caption">
          {beforeLabel}
        </Text>
        <Text as="p" color="body" variant="largeBody">
          {before}
        </Text>
      </div>
      <Text aria-hidden="true" as="span" cn={styles.arrow} color="accent" variant="h2">
        →
      </Text>
      <div className={`${styles.panel} ${styles.after}`}>
        <Text as="span" cn={styles.panelTitle} color="accent" variant="caption">
          {afterLabel}
        </Text>
        <div className={styles.panelContent}>{after}</div>
      </div>
    </div>
  </div>
);
