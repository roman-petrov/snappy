import styles from "./Pill.module.css";

interface Props { hint: string; name: string; }

export const Pill = ({ hint, name }: Props) => (
  <div className={styles[`pill`]}>
    <span className={styles[`pillLeft`]}>{name}</span>
    <span className={styles[`pillRight`]}>{hint}</span>
  </div>
);
