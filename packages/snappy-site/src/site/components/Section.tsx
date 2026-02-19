import type { ReactNode } from "react";

import { css } from "../../../styled-system/css";

export type SectionProps = { children: ReactNode; id?: string; lead: string; title: string };

export const Section = ({ children, id, lead: leadText, title }: SectionProps) => (
  <section
    className={css({
      "@media (width <= 640px)": { paddingBlock: "1.5rem" },
      "display": "flex",
      "flexDirection": "column",
      "gap": "1.5rem",
      "paddingBlock": "2rem",
      "scrollMarginTop": "4rem",
    })}
    id={id}
  >
    <h2
      className={css({
        "@media (width <= 640px)": { fontSize: "2xl", paddingInlineStart: "0.75rem" },
        "borderColor": "accent",
        "borderInlineStartStyle": "solid",
        "borderInlineStartWidth": "3px",
        "color": "text.heading",
        "fontSize": "3xl",
        "fontWeight": "extrabold",
        "letterSpacing": "tight",
        "lineHeight": "tight",
        "margin": "0 0 0.5rem",
        "paddingInlineStart": "1rem",
      })}
    >
      {title}
    </h2>
    <p className={css({ color: "text.muted", fontSize: "md", margin: "0 0 1.25rem" })}>{leadText}</p>
    {children}
  </section>
);
