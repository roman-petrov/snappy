/* eslint-disable react/forbid-component-props */
import type React from "react";

import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";

import { $, type Color, type Typography } from "../$";

type TextTag = `dd` | `div` | `dt` | `h1` | `h2` | `h3` | `label` | `p` | `span`;

const typographyTag: Record<Typography, TextTag> = {
  body: `p`,
  button: `span`,
  buttonLarge: `span`,
  caption: `span`,
  captionBold: `span`,
  display: `h1`,
  h1: `h1`,
  h2: `h2`,
  h3: `h3`,
  large: `p`,
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
  const className = _.cn(typographyClass, colorClass, cn);

  if (html) {
    return <Tag className={className} {...Html.text(text)} {...rest} />;
  }

  return (
    <Tag className={className} {...rest}>
      {text}
    </Tag>
  );
};
