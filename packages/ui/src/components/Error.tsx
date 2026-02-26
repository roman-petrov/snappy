import styles from "./Error.module.css";
import { Text } from "./Text";

export type ErrorProps = { text: string };

export const Error = ({ text }: ErrorProps) => (
  <div className={styles.root}>
    <Text as="p" color="error" text={text} typography="caption" />
  </div>
);
