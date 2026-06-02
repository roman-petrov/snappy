import { _ } from "@snappy/core";
import { $, Text } from "@snappy/ui";

import styles from "./ExampleBlock.module.scss";

export type ExampleBlockProps = {
  after: string;
  afterLabel: string;
  before: string;
  beforeLabel: string;
  label: string;
};

export const ExampleBlock = ({ after, afterLabel, before, beforeLabel, label }: ExampleBlockProps) => (
  <div className={styles.block}>
    <Text as="p" cn={styles.label} text={label} typography="h3" />
    <div className={styles.row}>
      <div className={_.cn(styles.panel, $.surface(`error`), $.elevation(`e2`))}>
        <Text cn={styles.panelTitle} color="error" text={beforeLabel.toUpperCase()} typography="caption" />
        <Text as="p" text={before} typography="large" />
      </div>
      <Text cn={styles.arrow} text="→" typography="h2" />
      <div className={_.cn(styles.panel, $.surface(`success`), $.elevation(`e2`))}>
        <Text cn={styles.panelTitle} color="success" text={afterLabel.toUpperCase()} typography="caption" />
        <Text html text={after} typography="large" />
      </div>
    </div>
  </div>
);
