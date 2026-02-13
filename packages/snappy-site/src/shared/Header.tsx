import type { ReactNode } from "react";

import styles from "./Header.module.css";
import { Logo } from "./Logo";

export type HeaderProps = {
  children: ReactNode;
  logoHref?: string;
  logoOnClick?: (e: React.MouseEvent) => void;
  logoTitle?: string;
  logoTo?: string;
};

export const Header = ({ children, logoHref, logoOnClick, logoTitle, logoTo }: HeaderProps) => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <Logo href={logoHref} onClick={logoOnClick} title={logoTitle} to={logoTo} />
      <nav className={styles.nav}>{children}</nav>
    </div>
  </header>
);
