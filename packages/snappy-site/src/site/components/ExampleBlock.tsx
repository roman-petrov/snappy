import { Text } from "@snappy/ui";

import styles from "./ExampleBlock.module.css";

export type ExampleBlockProps = {
  after: string;
  afterLabel: string;
  before: string;
  beforeLabel: string;
  label: string;
};

export const ExampleBlock = ({ after, afterLabel, before, beforeLabel, label }: ExampleBlockProps) => (
  <div className={styles.block}>
    <Text as="p" cn={styles.label} color="accent" text={label} typography="captionBold" />
    <div className={styles.row}>
      <div className={`${styles.panel} ${styles.before}`}>
        <Text as="span" cn={styles.panelTitle} color="error" text={beforeLabel} typography="caption" />
        <Text as="p" text={before} typography="largeBody" />
      </div>
      <Text aria-hidden="true" as="span" cn={styles.arrow} color="accent" text="→" typography="h2" />
      <div className={`${styles.panel} ${styles.after}`}>
        <Text as="span" cn={styles.panelTitle} color="accent" text={afterLabel} typography="caption" />
        <Text as="span" cn={styles.panelContent} html text={after} typography="largeBody" />
      </div>
    </div>
  </div>
);
