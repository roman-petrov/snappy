import styles from "./Steps.module.css";

interface Props { items: string[] }

export const Steps = ({ items }: Props) => (
  <div className={styles[`timeline`]}>
    <ol className={styles[`steps`]}>
      {items.map((text, index) => (
        <li key={index}>{text}</li>
      ))}
    </ol>
  </div>
);
