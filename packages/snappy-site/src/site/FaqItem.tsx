import styles from "./FaqItem.module.css";

type Props = { question: string; answer: string };

export const FaqItem = ({ question, answer }: Props) => (
  <div className={styles[`item`]}>
    <dt>{question}</dt>
    <dd>{answer}</dd>
  </div>
);
