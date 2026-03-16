import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import styles from "./Header.module.scss";
import { Logo } from "./Logo";

export type HeaderProps = { children: ReactNode; cn?: string };

export const Header = ({ children, cn = `` }: HeaderProps) => (
  <header className={_.cn(styles.header, cn)}>
    <div className={styles.inner}>
      <Logo />
      <nav className={styles.nav}>{children}</nav>
    </div>
  </header>
);
