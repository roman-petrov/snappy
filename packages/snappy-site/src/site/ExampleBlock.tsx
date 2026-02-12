import type { ReactNode } from "react";
import styles from "./ExampleBlock.module.css";

type Props = {
  label: string;
  beforeLabel: string;
  afterLabel: string;
  before: string;
  after: ReactNode;
};

export const ExampleBlock = ({ label, beforeLabel, afterLabel, before, after }: Props) => (
  <div className={styles[`block`]}>
    <p className={styles[`label`]}>{label}</p>
    <div className={styles[`row`]}>
      <div className={`${styles[`panel`]} ${styles[`before`]}`}>
        <span className={styles[`panelTitle`]}>{beforeLabel}</span>
        <p>{before}</p>
      </div>
      <span className={styles[`arrow`]} aria-hidden="true">
        →
      </span>
      <div className={`${styles[`panel`]} ${styles[`after`]}`}>
        <span className={styles[`panelTitle`]}>{afterLabel}</span>
        <p>{after}</p>
      </div>
    </div>
  </div>
);
