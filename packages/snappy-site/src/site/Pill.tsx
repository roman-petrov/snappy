import styles from "./Pill.module.css";

type Props = { name: string; hint: string };

export const Pill = ({ name, hint }: Props) => (
  <div className={styles[`pill`]}>
    <span className={styles[`pillLeft`]}>{name}</span>
    <span className={styles[`pillRight`]}>{hint}</span>
  </div>
);
