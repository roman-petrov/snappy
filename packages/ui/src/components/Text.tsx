/* eslint-disable react/forbid-component-props */
import type React from "react";

import { Html } from "@snappy/browser";

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
  html?: boolean;
  htmlFor?: string;
  text: string;
  typography?: Typography;
};

export const Text = ({ as, cn = ``, color = `body`, html = false, text, typography = `body`, ...rest }: TextProps) => {
  const Tag = as ?? typographyTag[typography];
  const typographyClass = $.typography(typography);
  const colorClass = $.color(color);
  const className = [typographyClass, colorClass, cn].filter(Boolean).join(` `).trim();

  if (html) {
    return <Tag className={className} {...Html.text(text)} {...(rest as React.HTMLAttributes<HTMLElement>)} />;
  }

  return (
    <Tag className={className} {...(rest as React.HTMLAttributes<HTMLElement>)}>
      {text}
    </Tag>
  );
};
