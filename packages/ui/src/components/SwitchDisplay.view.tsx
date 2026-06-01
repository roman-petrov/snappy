import { _ } from "@snappy/core";

import type { useSwitchDisplayState } from "./SwitchDisplay.state";

import styles from "./SwitchDisplay.module.scss";

export type SwitchDisplayViewProps = ReturnType<typeof useSwitchDisplayState>;

export const SwitchDisplayView = ({ checked, disabled }: SwitchDisplayViewProps) => (
  <span className={_.cn(styles.root, checked && styles.checked)} data-disabled={disabled || undefined}>
    <span className={styles.thumb} />
  </span>
);
