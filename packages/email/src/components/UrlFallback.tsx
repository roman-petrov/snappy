/* eslint-disable react/forbid-component-props */
import { Link, Text } from "react-email";

import { Colors, Layout } from "../core";

export type UrlFallbackProps = { href: string; label: string };

export const UrlFallback = ({ href, label }: UrlFallbackProps) => (
  <>
    <Text style={{ color: Colors.muted, fontSize: Layout.fontSize.small, margin: Layout.margin.urlLabel }}>
      {label}
    </Text>
    <Text style={{ fontSize: Layout.fontSize.small, lineHeight: 1.5, margin: 0, wordBreak: `break-all` }}>
      <Link href={href} style={{ color: Colors.accent, textDecoration: `none` }}>
        {href}
      </Link>
    </Text>
  </>
);
