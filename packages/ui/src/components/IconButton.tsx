import type { ReactNode } from "react";

import styles from "./IconButton.module.scss";
import { Ripple } from "./Ripple";

export type IconButtonProps = { ariaLabel: string; icon: ReactNode; onClick: () => void };

export const IconButton = ({ ariaLabel, icon, onClick }: IconButtonProps) => (
  <span className={styles.wrapper}>
    <Ripple center speedFactor={4}>
      <button aria-label={ariaLabel} className={styles.root} onClick={onClick} title={ariaLabel} type="button">
        {icon}
      </button>
    </Ripple>
  </span>
);
