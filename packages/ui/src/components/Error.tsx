import type { ReactNode } from "react";

import styles from "./Error.module.css";

export type ErrorProps = { children: ReactNode };

export const Error = ({ children }: ErrorProps) => <p className={styles.root}>{children}</p>;
