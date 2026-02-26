/* eslint-disable react/forbid-component-props */
import type React from "react";

import { $, type Color, type Typography } from "../$";

type TextTag = `dd` | `div` | `dt` | `h1` | `h2` | `h3` | `label` | `p` | `span`;

const typographyTag: Record<Typography, TextTag> = {
  body: `p`,
  bodyLg: `p`,
  caption: `span`,
  captionBold: `span`,
  display: `h1`,
  h1: `h1`,
  h2: `h2`,
  h3: `h3`,
  large: `p`,
  largeBody: `p`,
};

export type TextProps = Omit<React.HTMLAttributes<HTMLElement>, `as` | `children` | `className`> & {
  as?: TextTag;
  cn?: string;
  color?: Color;
  htmlFor?: string;
  text: string;
  typography?: Typography;
};

export const Text = ({ as, cn = ``, color, text, typography = `body`, ...rest }: TextProps) => {
  const Tag = as ?? typographyTag[typography];
  const typographyClass = $.typography(typography);
  const colorClass = $.color(color ?? `body`);
  const className = [typographyClass, colorClass, cn].filter(Boolean).join(` `).trim();

  return (
    <Tag className={className} {...(rest as React.HTMLAttributes<HTMLElement>)}>
      {text}
    </Tag>
  );
};
