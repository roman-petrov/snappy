import { i } from "@snappy/intl";

import styles from "./MessageLine.module.scss";

export type MessageLineProps = { cost?: number; status: `done` | `error` | `running`; text: string };

export const MessageLine = ({ cost, status, text }: MessageLineProps) => (
  <p className={styles.line}>
    {status === `running` ? (
      <span className={styles.spinner} />
    ) : (
      <span className={styles.icon}>{status === `error` ? `✕` : `✓`}</span>
    )}
    <span>{text}</span>
    {cost === undefined ? undefined : <span className={styles.cost}>{i.price(cost)}</span>}
  </p>
);
