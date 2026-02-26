/* eslint-disable react/forbid-component-props */
import type { ReactNode } from "react";
import type React from "react";

import type { Color, Typography } from "../$";

import { $ } from "../$";

export type TextProps = Omit<React.HTMLAttributes<HTMLElement>, `as` | `children` | `className`> & {
  as?: `dd` | `div` | `dt` | `h1` | `h2` | `h3` | `label` | `p` | `span`;
  children: ReactNode;
  cn?: string;
  color?: Color;
  htmlFor?: string;
  typography?: Typography;
  variant: TextVariant;
};

const variantTag = {
  bodyLg: `p`,
  caption: `span`,
  captionBold: `span`,
  display: `h1`,
  h1: `h1`,
  h2: `h2`,
  h3: `h3`,
  large: `p`,
  largeBody: `p`,
} as const;

export type TextVariant = keyof typeof variantTag;

export const Text = ({ as, children, cn = ``, color, typography, variant, ...rest }: TextProps) => {
  const Tag = as ?? variantTag[variant];
  const typographyClass = $.typography(typography ?? variant);
  const colorClass = color ? $.color(color) : ``;
  const className = [typographyClass, colorClass, cn].filter(Boolean).join(` `).trim();

  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
};
