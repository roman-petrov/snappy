import styles from "./Pill.module.css";

export type PillProps = { hint: string; name: string };

export const Pill = ({ hint, name }: PillProps) => (
  <div className={styles[`pill`]}>
    <span className={styles[`pillLeft`]}>{name}</span>
    <span className={styles[`pillRight`]}>{hint}</span>
  </div>
);
