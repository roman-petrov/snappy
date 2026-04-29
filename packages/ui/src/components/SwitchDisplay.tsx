import { _ } from "@snappy/core";

import styles from "./SwitchDisplay.module.scss";

export type SwitchDisplayProps = { checked?: boolean; disabled?: boolean };

export const SwitchDisplay = ({ checked = false, disabled = false }: SwitchDisplayProps) => (
  <span className={_.cn(styles.root, checked && styles.checked)} data-disabled={disabled || undefined}>
    <span className={styles.thumb} />
  </span>
);
