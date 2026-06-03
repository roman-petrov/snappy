import type { ReactNode } from "react";

import styles from "./DefaultHeader.module.scss";
import { Logo } from "./Logo";
import { SafeArea } from "./SafeArea";

export type DefaultHeaderProps = { trailing: ReactNode };

export const DefaultHeader = ({ trailing }: DefaultHeaderProps) => (
  <SafeArea top>
    <div className={styles.inner}>
      <Logo />
      <div className={styles.trailing}>{trailing}</div>
    </div>
  </SafeArea>
);
