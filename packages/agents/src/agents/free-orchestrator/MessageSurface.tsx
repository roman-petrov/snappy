import type { PropsWithChildren } from "react";

import styles from "./MessageSurface.module.scss";

export const MessageSurface = ({ children }: PropsWithChildren) => <div className={styles.root}>{children}</div>;
