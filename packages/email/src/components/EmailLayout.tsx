/* eslint-disable react/forbid-component-props */
import type { Locale } from "@snappy/intl";
import type { ReactNode } from "react";

import { Body, Container, Head, Html, Section } from "react-email";

import { Colors, Layout } from "../core";

export type EmailLayoutProps = { children: ReactNode; locale: Locale };

export const EmailLayout = ({ children, locale }: EmailLayoutProps) => (
  <Html lang={locale}>
    <Head />
    <Body style={{ background: Colors.backdrop, fontFamily: Layout.font, margin: 0, padding: 0 }}>
      <Section style={{ background: Colors.backdrop, padding: Layout.padding.section, width: `100%` }}>
        <Container
          style={{
            background: Colors.surface,
            border: Layout.border,
            borderRadius: Layout.radius.container,
            maxWidth: Layout.maxWidth,
            padding: Layout.padding.container,
            width: `100%`,
          }}
        >
          {children}
        </Container>
      </Section>
    </Body>
  </Html>
);
