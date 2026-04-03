import type { ReactNode } from "react";

import styles from "./FeedCard.module.scss";

export type FeedCardProps = { children: ReactNode };

export const FeedCard = ({ children }: FeedCardProps) => <div className={styles.root}>{children}</div>;
