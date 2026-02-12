import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.css";

type LogoProps = {
  href?: string;
  to?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
};

const Logo = ({ href, to, onClick, title }: LogoProps) => {
  const content = (
    <>
      <img src="/favicon.svg" alt="" className={styles[`logoIcon`]} width={20} height={20} aria-hidden="true" /> Snappy
    </>
  );
  const className = styles[`logo`];
  if (to !== undefined) {
    return (
      <Link className={className} to={to} title={title} onClick={onClick}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href ?? `/`} className={className} title={title} onClick={onClick}>
      {content}
    </a>
  );
};

export type HeaderProps = {
  logoHref?: string;
  logoTo?: string;
  logoOnClick?: (e: React.MouseEvent) => void;
  logoTitle?: string;
  children: ReactNode;
};

export const Header = ({ logoHref, logoTo, logoOnClick, logoTitle, children }: HeaderProps) => (
  <header className={styles[`header`]}>
    <div className={styles[`inner`]}>
      <Logo href={logoHref} to={logoTo} onClick={logoOnClick} title={logoTitle} />
      <nav className={styles[`nav`]}>{children}</nav>
    </div>
  </header>
);
