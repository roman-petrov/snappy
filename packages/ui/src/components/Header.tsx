import type { ReactNode } from "react";

import styles from "./Header.module.scss";
import { Logo } from "./Logo";

export type HeaderProps = { children: ReactNode };

export const Header = ({ children }: HeaderProps) => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <Logo />
      <nav className={styles.nav}>{children}</nav>
    </div>
  </header>
);
