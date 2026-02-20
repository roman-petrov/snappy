/* eslint-disable react/forbid-component-props */
import type { ReactNode } from "react";
import type React from "react";

import styles from "./Text.module.css";

export type TextProps = Omit<React.HTMLAttributes<HTMLElement>, `as` | `children` | `className`> & {
  as?: `dd` | `div` | `dt` | `h1` | `h2` | `h3` | `label` | `p` | `span`;
  children: ReactNode;
  cn?: string;
  htmlFor?: string;
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

export const Text = ({ as, children, cn = ``, variant, ...rest }: TextProps) => {
  const Tag = as ?? variantTag[variant];
  const className = cn ? `${styles[variant]} ${cn}`.trim() : styles[variant];

  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
};
