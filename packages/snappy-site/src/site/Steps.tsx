import styles from "./Steps.module.css";

export type StepsProps = { items: string[] };

export const Steps = ({ items }: StepsProps) => (
  <div className={styles[`timeline`]}>
    <ol className={styles[`steps`]}>
      {items.map((text, index) => (
        <li key={index}>{text}</li>
      ))}
    </ol>
  </div>
);
