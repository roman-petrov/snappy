import type { ReactNode } from "react";

import styles from "./Block.module.scss";

export type BlockProps = { children: ReactNode };

export const Block = ({ children }: BlockProps) => (
  <div className={styles.root}>
    <div className={styles.scroll}>
      <div className={styles.body}>{children}</div>
    </div>
  </div>
);
