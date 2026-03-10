import type { ReactNode } from "react";

import styles from "./Header.module.scss";
import { Logo } from "./Logo";

export type HeaderProps = { children: ReactNode; cn?: string };

export const Header = ({ children, cn = `` }: HeaderProps) => (
  <header className={[styles.header, cn].filter(Boolean).join(` `)}>
    <div className={styles.inner}>
      <Logo />
      <nav className={styles.nav}>{children}</nav>
    </div>
  </header>
);
