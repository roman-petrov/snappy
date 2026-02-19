import type { ReactNode } from "react";

import { css } from "../../styled-system/css";
import { Card } from "./Card";

export type PanelProps = { children: ReactNode; lead?: string; title: string };

export const Panel = ({ children, lead, title }: PanelProps) => (
  <div
    className={css({
      alignItems: "center",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      paddingBlock: "8",
      paddingInline: "4",
    })}
  >
    <Card>
      <h1
        className={css({
          borderColor: "accent",
          borderInlineStartStyle: "solid",
          borderInlineStartWidth: "accent",
          color: "text.heading",
          fontSize: "2xl",
          fontWeight: "extrabold",
          letterSpacing: "tight",
          lineHeight: "tight",
          margin: "0",
          marginBlockEnd: "6",
          paddingInlineStart: "4",
        })}
      >
        {title}
      </h1>
      {lead !== undefined && (
        <p className={css({ color: "text.muted", fontSize: "md", lineHeight: "relaxed", margin: "0", marginBlockEnd: "6" })}>
          {lead}
        </p>
      )}
      {children}
    </Card>
  </div>
);
