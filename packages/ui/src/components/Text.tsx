/* eslint-disable react/forbid-component-props */
import type React from "react";

import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";

import { $, type Color, type Typography } from "../$";

export type TextProps = Omit<React.HTMLAttributes<HTMLElement>, `as` | `children` | `className`> & {
  as?: TextTag;
  cn?: string;
  color?: Color;
  html?: boolean;
  htmlFor?: string;
  text: string;
  typography?: Typography;
};

type TextTag = `article` | `dd` | `div` | `dt` | `h1` | `h2` | `h3` | `label` | `p` | `span`;

export const Text = ({
  as: Tag = `span`,
  cn = ``,
  color,
  html = false,
  text,
  typography = `body`,
  ...rest
}: TextProps) => (
  <Tag
    className={_.cn($.typography(typography), $.color(color), cn)}
    {...(html ? Html.text(text) : { children: text })}
    {...rest}
  />
);
