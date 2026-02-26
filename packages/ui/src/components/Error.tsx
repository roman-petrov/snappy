import type { ReactNode } from "react";

import styles from "./Error.module.css";
import { Text } from "./Text";

export type ErrorProps = { children: ReactNode };

export const Error = ({ children }: ErrorProps) => (
  <div className={styles.root}>
    <Text as="p" color="error" variant="caption">
      {children}
    </Text>
  </div>
);
