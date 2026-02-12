import type { ReactNode } from "react";

import styles from "./ExampleBlock.module.css";

export type ExampleBlockProps = {
  after: ReactNode;
  afterLabel: string;
  before: string;
  beforeLabel: string;
  label: string;
};

export const ExampleBlock = ({ after, afterLabel, before, beforeLabel, label }: ExampleBlockProps) => (
  <div className={styles[`block`]}>
    <p className={styles[`label`]}>{label}</p>
    <div className={styles[`row`]}>
      <div className={`${styles[`panel`]} ${styles[`before`]}`}>
        <span className={styles[`panelTitle`]}>{beforeLabel}</span>
        <p>{before}</p>
      </div>
      <span aria-hidden="true" className={styles[`arrow`]}>
        →
      </span>
      <div className={`${styles[`panel`]} ${styles[`after`]}`}>
        <span className={styles[`panelTitle`]}>{afterLabel}</span>
        <p>{after}</p>
      </div>
    </div>
  </div>
);
