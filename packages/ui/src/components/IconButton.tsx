import type { ReactNode } from "react";

import styles from "./IconButton.module.scss";

export type IconButtonProps = { ariaLabel: string; icon: ReactNode; onClick: () => void };

export const IconButton = ({ ariaLabel, icon, onClick }: IconButtonProps) => (
  <button aria-label={ariaLabel} className={styles.root} onClick={onClick} title={ariaLabel} type="button">
    {icon}
  </button>
);
