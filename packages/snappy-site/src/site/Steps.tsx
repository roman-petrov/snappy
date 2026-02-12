import styles from "./Steps.module.css";

type Props = { items: string[] };

export const Steps = ({ items }: Props) => (
  <div className={styles[`timeline`]}>
    <ol className={styles[`steps`]}>
      {items.map((text, i) => (
        <li key={i}>{text}</li>
      ))}
    </ol>
  </div>
);
