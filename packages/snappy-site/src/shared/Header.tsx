import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import styles from "./Header.module.css";

interface LogoProps { href?: string; onClick?: (e: React.MouseEvent) => void; title?: string; to?: string; }

const Logo = ({ href, onClick, title, to }: LogoProps) => {
  const content = (
    <>
      <img alt="" aria-hidden="true" className={styles[`logoIcon`]} height={20} src="/favicon.svg" width={20} /> Snappy
    </>
  );

  const className = styles[`logo`];
  if (to !== undefined) {
    return (
      <Link className={className} onClick={onClick} title={title} to={to}>
        {content}
      </Link>
    );
  }

  return (
    <a className={className} href={href ?? `/`} onClick={onClick} title={title}>
      {content}
    </a>
  );
};

export interface HeaderProps {
  children: ReactNode;
  logoHref?: string;
  logoOnClick?: (e: React.MouseEvent) => void;
  logoTitle?: string;
  logoTo?: string;
}

export const Header = ({ children, logoHref, logoOnClick, logoTitle, logoTo }: HeaderProps) => (
  <header className={styles[`header`]}>
    <div className={styles[`inner`]}>
      <Logo href={logoHref} onClick={logoOnClick} title={logoTitle} to={logoTo} />
      <nav className={styles[`nav`]}>{children}</nav>
    </div>
  </header>
);
