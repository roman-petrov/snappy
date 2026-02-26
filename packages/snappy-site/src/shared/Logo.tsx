/* eslint-disable react/forbid-component-props */
import type { MouseEvent } from "react";

import { Text } from "@snappy/ui";
import { Link } from "react-router-dom";

import styles from "./Header.module.css";

export type LogoProps = { href?: string; onClick?: (event: MouseEvent) => void; title?: string; to?: string };

const logoContent = (
  <>
    <img alt="" aria-hidden="true" className={styles.logoIcon} height={20} src="/favicon.svg" width={20} />
    {` `}
    <Text as="span" color="accent" variant="h3">
      Snappy
    </Text>
  </>
);

export const Logo = ({ href, onClick, title, to }: LogoProps) => {
  const className = styles.logo;

  return to === undefined ? (
    <a className={className} href={href ?? `/`} onClick={onClick} title={title}>
      {logoContent}
    </a>
  ) : (
    <Link className={className} onClick={onClick} title={title} to={to}>
      {logoContent}
    </Link>
  );
};
