import type { ReactNode } from "react";

import styles from "./IconButton.module.scss";
import { Tap, type TapProps } from "./Tap";

export type IconButtonProps = Omit<TapProps, `children` | `cn`> & { ariaLabel: string; icon: ReactNode };

export const IconButton = ({ ariaLabel, icon, ...tapProps }: IconButtonProps) => (
  <Tap {...tapProps} ariaLabel={ariaLabel} cn={styles.root} title={ariaLabel}>
    {icon}
  </Tap>
);
