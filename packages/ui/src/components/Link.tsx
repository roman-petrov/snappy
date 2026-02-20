/* eslint-disable react/forbid-component-props */
import type { ReactNode } from "react";

import { Link as RouterLink } from "react-router-dom";

import styles from "./Link.module.css";
import { Text } from "./Text";

export type LinkProps = {
  children: ReactNode;
  href?: string;
  muted?: boolean;
  rel?: string;
  target?: string;
  to?: string;
};

export const Link = ({ children, href, muted = false, rel, target, to }: LinkProps) => {
  const linkClass = muted ? styles.muted : styles.accent;

  return to === undefined ? (
    <a className={linkClass} href={href ?? `#`} rel={rel} target={target}>
      <Text cn={linkClass} variant="caption">
        {children}
      </Text>
    </a>
  ) : (
    <RouterLink className={linkClass} to={to} viewTransition>
      <Text cn={linkClass} variant="caption">
        {children}
      </Text>
    </RouterLink>
  );
};
