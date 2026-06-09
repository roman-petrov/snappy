/* eslint-disable react/forbid-component-props */
import { Button } from "react-email";

import { Colors, Layout } from "../core";

export type PrimaryButtonProps = { href: string; text: string };

export const PrimaryButton = ({ href, text }: PrimaryButtonProps) => (
  <Button
    href={href}
    style={{
      background: Colors.accent,
      borderRadius: Layout.radius.button,
      color: Colors.onAccent,
      display: `inline-block`,
      fontSize: Layout.fontSize.body,
      fontWeight: 600,
      padding: Layout.padding.button,
      textDecoration: `none`,
    }}
  >
    {text}
  </Button>
);
