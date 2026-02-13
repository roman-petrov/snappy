import type { ReactNode } from "react";

import { Link as RouterLink } from "react-router-dom";

import styles from "./Link.module.css";

export type LinkProps = {
  children: ReactNode;
  href?: string;
  muted?: boolean;
  rel?: string;
  target?: string;
  to?: string;
};

export const Link = ({ children, href, muted = false, rel, target, to }: LinkProps) => {
  const className = styles[muted ? `muted` : `accent`];

  return to === undefined ? (
    <a className={className} href={href ?? `#`} rel={rel} target={target}>
      {children}
    </a>
  ) : (
    <RouterLink className={className} to={to} viewTransition>
      {children}
    </RouterLink>
  );
};
