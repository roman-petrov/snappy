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

type TextTag = `dd` | `div` | `dt` | `h1` | `h2` | `h3` | `label` | `p` | `span`;

export const Text = ({
  as = `span`,
  cn = ``,
  color = `text`,
  html = false,
  text,
  typography = `body`,
  ...rest
}: TextProps) => {
  const Tag = as;
  const className = _.cn($.typography(typography), $.color(color), cn);

  if (html) {
    return <Tag className={className} {...Html.text(text)} {...rest} />;
  }

  return (
    <Tag className={className} {...rest}>
      {text}
    </Tag>
  );
};
