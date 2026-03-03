/* eslint-disable react/forbid-component-props */
import type { MouseEvent } from "react";

import { Link } from "react-router-dom";

import { faviconUrl } from "../assets";
import styles from "./Logo.module.scss";
import { Text } from "./Text";

export type LogoProps = { href?: string; onClick?: (event: MouseEvent) => void; title?: string; to?: string };

export const Logo = ({ href, onClick, title, to }: LogoProps) => {
  const className = styles.logo;

  const content = (
    <>
      <img alt="" aria-hidden="true" className={styles.logoIcon} height={20} src={faviconUrl} width={20} />
      {` `}
      <Text as="span" color="accent" text="Snappy" typography="h3" />
    </>
  );

  return to === undefined ? (
    <a className={className} href={href ?? `/`} onClick={onClick} title={title}>
      {content}
    </a>
  ) : (
    <Link className={className} onClick={onClick} title={title} to={to}>
      {content}
    </Link>
  );
};
