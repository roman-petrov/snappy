import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

export type PillProps = { hint: string; name: string };

export const Pill = ({ hint, name }: PillProps) => (
  <div
    className={flex({
      "@media (width <= 640px)": { direction: "column" },
      "_hover": { borderColor: "rgb(var(--rgb-accent) / 40%)" },
      "border": "1px solid",
      "borderColor": "rgb(var(--rgb-accent) / 20%)",
      "borderRadius": "radius",
      "overflow": "hidden",
      "transition": "all 0.2s ease",
    })}
  >
    <span
      className={css({
        bg: "rgb(var(--rgb-accent) / 12%)",
        color: "text.heading",
        flexShrink: 0,
        fontSize: "md",
        fontWeight: "semibold",
        padding: "0.75rem 1rem",
      })}
    >
      {name}
    </span>
    <span
      className={css({
        bg: "rgb(var(--rgb-accent) / 4%)",
        color: "text.muted",
        flex: 1,
        fontSize: "md",
        padding: "0.75rem 1rem",
      })}
    >
      {hint}
    </span>
  </div>
);
