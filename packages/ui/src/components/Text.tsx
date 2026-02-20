/* eslint-disable react/forbid-component-props */
import type { ReactNode } from "react";

import styles from "./Text.module.css";

export type TextProps = {
  as?: `h1` | `h2` | `h3` | `p` | `span`;
  children: ReactNode;
  cn?: string;
  variant: TextVariant;
};

export type TextVariant = `h1` | `h2` | `h3` | `hero` | `lead` | `muted`;

const variantTag: Record<TextVariant, `h1` | `h2` | `h3` | `p` | `span`> = {
  h1: `h1`,
  h2: `h2`,
  h3: `h3`,
  hero: `h1`,
  lead: `p`,
  muted: `span`,
};

export const Text = ({ as, children, cn = ``, variant }: TextProps) => {
  const Tag = as ?? variantTag[variant];

  return <Tag className={`${styles[variant]} ${cn}`.trim()}>{children}</Tag>;
};
