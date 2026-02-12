import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import styles from "./MutedLink.module.css";

export type MutedLinkProps = { children: ReactNode; href?: string; to?: string };

export const MutedLink = ({ children, href, to }: MutedLinkProps) => {
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
