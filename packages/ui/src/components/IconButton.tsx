import type { ReactNode } from "react";

import styles from "./IconButton.module.scss";
import { Tap, type TapProps } from "./Tap";

export type IconButtonProps = Omit<TapProps, `children` | `cn` | `tip` | `vibrate`> & { icon: ReactNode; tip: string };

export const IconButton = ({ icon, tip, ...tapProps }: IconButtonProps) => (
  <Tap {...tapProps} cn={styles.root} tip={tip} vibrate="confirm">
    {icon}
  </Tap>
);
