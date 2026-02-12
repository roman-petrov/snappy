import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import styles from "./AccentLink.module.css";

export type AccentLinkProps = { children: ReactNode; href?: string; to?: string };

export const AccentLink = ({ children, href, to }: AccentLinkProps) => {
  const className = styles[`link`];

  return to === undefined ? (
    <a className={className} href={href ?? `#`}>
      {children}
    </a>
  ) : (
    <Link className={className} to={to} viewTransition>
      {children}
    </Link>
  );
};
