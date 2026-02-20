import type { ReactNode } from "react";

import styles from "./ListItem.module.css";

export type ListItemProps = { children: ReactNode };

export const ListItem = ({ children }: ListItemProps) => <div className={styles.root}>{children}</div>;
