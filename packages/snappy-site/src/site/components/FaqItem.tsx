import styles from "./FaqItem.module.css";

export type FaqItemProps = { answer: string; question: string };

export const FaqItem = ({ answer, question }: FaqItemProps) => (
  <div className={styles.item}>
    <dt>{question}</dt>
    <dd>{answer}</dd>
  </div>
);
