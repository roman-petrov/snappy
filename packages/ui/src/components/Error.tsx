import type { ReactNode } from "react";

import { Text } from "./Text";
import styles from "./Error.module.css";

export type ErrorProps = { children: ReactNode };

export const Error = ({ children }: ErrorProps) => (
  <Text as="p" cn={styles.root} variant="caption">
    {children}
  </Text>
);
