/* eslint-disable react/forbid-component-props */
import { Link as RouterLink } from "react-router-dom";

import styles from "./Link.module.scss";
import { Text } from "./Text";

export type LinkProps = { href?: string; muted?: boolean; rel?: string; target?: string; text: string; to?: string };

export const Link = ({ href, muted = false, rel, target, text, to }: LinkProps) => {
  const linkClass = muted ? styles.muted : styles.accent;

  return to === undefined ? (
    <a className={linkClass} href={href ?? `#`} rel={rel} target={target}>
      <Text color={muted ? `muted` : `accent`} text={text} typography="caption" />
    </a>
  ) : (
    <RouterLink className={linkClass} to={to} viewTransition>
      <Text color={muted ? `muted` : `accent`} text={text} typography="caption" />
    </RouterLink>
  );
};
