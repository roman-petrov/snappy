import type { ListViewProps } from "../../../core/Types";

import { Block } from "./Block";
import styles from "./List.module.scss";

export const List = ({ children }: ListViewProps) => (
  <Block children={<div className={styles.inner}>{children}</div>} />
);
