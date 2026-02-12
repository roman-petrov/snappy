import styles from "./FaqItem.module.css";

interface Props { answer: string; question: string; }

export const FaqItem = ({ answer, question }: Props) => (
  <div className={styles[`item`]}>
    <dt>{question}</dt>
    <dd>{answer}</dd>
  </div>
);
