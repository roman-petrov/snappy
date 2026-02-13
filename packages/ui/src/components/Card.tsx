import type { ReactNode } from "react";

import styles from "./Card.module.css";

export type CardProps = { children: ReactNode };

export const Card = ({ children }: CardProps) => <div className={styles.root}>{children}</div>;
