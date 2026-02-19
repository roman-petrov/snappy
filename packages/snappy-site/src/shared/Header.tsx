import type { MouseEvent, ReactNode } from "react";

import { css } from "../../styled-system/css";
import { hstack } from "../../styled-system/patterns";
import { Logo } from "./Logo";

export type HeaderProps = {
  children: ReactNode;
  logoHref?: string;
  logoOnClick?: (event: MouseEvent) => void;
  logoTitle?: string;
  logoTo?: string;
};

export const Header = ({ children, logoHref, logoOnClick, logoTitle, logoTo }: HeaderProps) => (
  <header
    className={css({
      backdropFilter: "blur(12px)",
      bg: "bg.header",
      borderBottom: "1px solid",
      borderColor: "border",
      position: "sticky",
      top: 0,
      zIndex: 10,
    })}
  >
    <div
      className={hstack({
        "@media (width <= 640px)": { paddingInline: "1rem" },
        "boxSizing": "border-box",
        "gap": "1rem",
        "justifyContent": "space-between",
        "marginInline": "auto",
        "maxWidth": "1100px",
        "padding": "1rem 1.5rem",
        "width": "100%",
      })}
    >
      <Logo href={logoHref} onClick={logoOnClick} title={logoTitle} to={logoTo} />
      <nav
        className={css({
          "@media (width <= 640px)": { gap: "1rem" },
          "alignItems": "center",
          "display": "flex",
          "gap": "1.5rem",
        })}
      >
        {children}
      </nav>
    </div>
  </header>
);
