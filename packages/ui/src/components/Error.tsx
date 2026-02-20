import type { ReactNode } from "react";

import styles from "./Error.module.css";
import { Text } from "./Text";

export type ErrorProps = { children: ReactNode };

export const Error = ({ children }: ErrorProps) => (
  <Text as="p" cn={styles.root} variant="caption">
    {children}
  </Text>
);
