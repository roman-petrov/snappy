import type { ReactNode } from "react";

import styles from "./SwitchButton.module.scss";

export type SwitchButtonProps = { ariaLabel: string; label: ReactNode; onClick: () => void };

export const SwitchButton = ({ ariaLabel, label, onClick }: SwitchButtonProps) => (
  <button aria-label={ariaLabel} className={styles.toggle} onClick={onClick} title={ariaLabel} type="button">
    {label}
  </button>
);
