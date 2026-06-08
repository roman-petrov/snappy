import type { ListViewProps } from "../../../core/Types";

import { Block } from "./Block";
import styles from "./List.module.scss";

export const List = ({ children }: ListViewProps) => (
  <Block>
    <div className={styles.scroll}>
      <div className={styles.body}>{children}</div>
    </div>
  </Block>
);
