/* eslint-disable react/forbid-component-props */
import type { ReactNode } from "react";

import { Link as RouterLink } from "react-router-dom";

import { cva } from "../../styled-system/css";

export type LinkVariantProps = { variant?: "accent" | "muted" };

export type LinkProps = LinkVariantProps & {
  children: ReactNode;
  href?: string;
  muted?: boolean;
  rel?: string;
  target?: string;
  to?: string;
};

export const Link = ({ children, href, muted = false, rel, target, to, variant }: LinkProps) => {
  const className = cva({
    base: {
      _focusVisible: {
        borderRadius: "sm",
        outline: "{borderWidths.medium} solid {colors.accent}",
        outlineOffset: "2",
      },
      fontSize: "sm",
      textDecoration: "none",
    },
    defaultVariants: { variant: "accent" },
    variants: {
      variant: {
        accent: { _hover: { textDecoration: "underline" }, color: "accent" },
        muted: { _hover: { color: "text.body", textDecoration: "none" }, color: "text.muted", fontWeight: "medium" },
      },
    },
  })({ variant: variant ?? (muted ? "muted" : "accent") });

  return to === undefined ? (
    <a className={className} href={href ?? "#"} rel={rel} target={target}>
      {children}
    </a>
  ) : (
    <RouterLink className={className} to={to} viewTransition>
      {children}
    </RouterLink>
  );
};
