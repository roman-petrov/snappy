import type { ReactNode } from "react";

import { Link } from "react-router-dom";

import styles from "./MutedLink.module.css";

interface Props { children: ReactNode; href?: string; to?: string; }

export const MutedLink = ({ children, href, to }: Props) => {
  const className = styles[`link`];
  if (to !== undefined) {
    return (
      <Link className={className} to={to} viewTransition>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href ?? `#`}>
      {children}
    </a>
  );
};
