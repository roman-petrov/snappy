/* eslint-disable react/forbid-component-props */
import type { ReactNode } from "react";

import { Heading } from "react-email";

import { Colors, Layout } from "../core";

export type TitleProps = { children: ReactNode };

export const Title = ({ children }: TitleProps) => (
  <Heading
    as="h1"
    style={{
      color: Colors.text,
      fontSize: Layout.fontSize.heading,
      fontWeight: 600,
      lineHeight: 1.3,
      margin: Layout.margin.bottom12,
    }}
  >
    {children}
  </Heading>
);
