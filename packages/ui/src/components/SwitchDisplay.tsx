import { _ } from "@snappy/core";

import styles from "./SwitchDisplay.module.scss";

export type SwitchDisplayProps = { checked?: boolean; disabled?: boolean };

export const SwitchDisplay = ({ checked = false, disabled = false }: SwitchDisplayProps) => (
  <span aria-hidden className={_.cn(styles.root, checked && styles.checked)} data-disabled={disabled || undefined}>
    <span aria-hidden className={styles.thumb} />
  </span>
);
