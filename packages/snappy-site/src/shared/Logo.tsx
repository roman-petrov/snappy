/* eslint-disable react/forbid-component-props */
import type { MouseEvent } from "react";

import { Link } from "react-router-dom";

import { css } from "../../styled-system/css";

export type LogoProps = { href?: string; onClick?: (event: MouseEvent) => void; title?: string; to?: string };

const logo = css({
  _focusVisible: { borderRadius: `4px`, outline: `2px solid var(--color-focus-ring)`, outlineOffset: `2px` },
  _hover: { opacity: 0.9, textDecoration: `none` },
  alignItems: `center`,
  color: `accent`,
  display: `inline-flex`,
  fontSize: `xl`,
  fontWeight: `extrabold`,
  gap: `0.5rem`,
  letterSpacing: `tight`,
  textDecoration: `none`,
});

const logoIcon = css({ height: `1.25em`, verticalAlign: `-0.25em`, width: `1.25em` });

const logoContent = (
  <>
    <img alt="" aria-hidden="true" className={logoIcon} height={20} src="/favicon.svg" width={20} /> Snappy
  </>
);

export const Logo = ({ href, onClick, title, to }: LogoProps) =>
  to === undefined ? (
    <a className={logo} href={href ?? `/`} onClick={onClick} title={title}>
      {logoContent}
    </a>
  ) : (
    <Link className={logo} onClick={onClick} title={title} to={to}>
      {logoContent}
    </Link>
  );
