import type { ReactNode } from "react";

import { css } from "../../styled-system/css";

export type CardProps = { children: ReactNode };

export const Card = ({ children }: CardProps) => (
  <div
    className={css({
      "@media (width <= 640px)": { padding: "4" },
      _hover: { boxShadow: "cardHover" },
      backdropBlur: "sm",
      bg: "bg.card",
      border: "{borderWidths.thin} solid {colors.bg.cardBorder}",
      borderRadius: "radius",
      boxShadow: "card",
      boxSizing: "border-box",
      maxWidth: "contentNarrow",
      padding: "8",
      transitionDuration: "fast",
      transitionProperty: "box-shadow",
      transitionTimingFunction: "default",
      width: "full",
    })}
  >
    {children}
  </div>
);
