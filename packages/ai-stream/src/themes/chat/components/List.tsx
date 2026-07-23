import type { ListViewProps } from "../../../core/Types";

import styles from "./List.module.scss";

export const List = ({ children }: ListViewProps) => <div className={styles.root}>{children}</div>;
