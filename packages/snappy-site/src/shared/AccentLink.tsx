import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./AccentLink.module.css";

type Props = { href?: string; to?: string; children: ReactNode };

export const AccentLink = ({ href, to, children }: Props) => {
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
