/* eslint-disable react/forbid-component-props */
import type { ReactNode } from "react";

import styles from "./Text.module.css";

export type TextProps = {
  as?: `h1` | `h2` | `h3` | `p` | `span`;
  children: ReactNode;
  cn?: string;
  variant: TextVariant;
};

export type TextVariant = `body` | `h1` | `h2` | `h3` | `hero` | `lead` | `muted`;

export const Text = ({ as: Tag = `p`, children, cn = ``, variant }: TextProps) => (
  <Tag className={`${styles[variant]} ${cn}`.trim()}>{children}</Tag>
);
