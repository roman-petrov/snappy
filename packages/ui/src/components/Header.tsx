import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import styles from "./Header.module.scss";
import { Logo } from "./Logo";
import { SafeArea } from "./SafeArea";

export type HeaderProps = { children: ReactNode; cn?: string };

export const Header = ({ children, cn = `` }: HeaderProps) => (
  <header className={_.cn(styles.root, cn)}>
    <SafeArea top>
      <div className={styles.inner}>
        <Logo />
        <div className={styles.trailing}>{children}</div>
      </div>
    </SafeArea>
  </header>
);
