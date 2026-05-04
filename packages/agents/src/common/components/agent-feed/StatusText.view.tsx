import { _ } from "@snappy/core";
import { Text } from "@snappy/ui";

import type { useStatusTextState } from "./StatusText.state";

import styles from "./StatusText.module.scss";

export type StatusTextViewProps = ReturnType<typeof useStatusTextState>;

export const StatusTextView = ({ message, status, textProps }: StatusTextViewProps) =>
  status === `done` ? undefined : (
    <span className={_.cn(styles.badge, status === `running` ? styles.badgeRunning : styles.badgeError)}>
      <span className={styles.status}>
        {status === `running` ? <span className={styles.spinner} /> : <span className={styles.icon}>❌</span>}
      </span>
      <Text cn={styles.message} text={message} {...textProps} />
    </span>
  );
