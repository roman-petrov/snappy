import { Text } from "@snappy/ui";

import type { useStatusTextState } from "./StatusText.state";

import styles from "./StatusText.module.scss";

export type StatusTextViewProps = ReturnType<typeof useStatusTextState>;

export const StatusTextView = ({ icon, isRunning, message, textProps }: StatusTextViewProps) => (
  <>
    <span className={styles.status}>
      {isRunning ? <span className={styles.spinner} /> : <span className={styles.icon}>{icon}</span>}
    </span>
    <Text cn={styles.message} text={message} {...textProps} />
  </>
);
