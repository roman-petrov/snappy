import { Link } from "@snappy/ui";

import { css } from "../../../styled-system/css";
import { hstack } from "../../../styled-system/patterns";
import { t } from "../core";

export const SiteFooter = () => (
  <footer
    className={css({
      "@media (width <= 640px)": { marginBlockStart: "2rem", padding: "2.5rem 1rem" },
      "bg": "bg.elevated",
      "borderBlockStart": "1px solid",
      "borderColor": "border",
      "boxSizing": "border-box",
      "marginBlockStart": "3rem",
      "padding": "2.5rem 1.5rem",
    })}
  >
    <div
      className={css({
        "& a": { color: "accent", fontWeight: "medium", marginTop: "0.5rem" },
        "& p": { color: "text.muted", fontSize: "md", margin: "0 0 0.5rem" },
        "boxSizing": "border-box",
        "marginInline": "auto",
        "maxWidth": "1100px",
        "paddingInline": "1rem",
        "textAlign": "center",
        "width": "100%",
      })}
    >
      <span
        className={hstack({
          alignItems: "center",
          color: "accent",
          fontSize: "xl",
          fontWeight: "extrabold",
          gap: "0.5rem",
          letterSpacing: "tight",
          marginBlockEnd: "0.75rem",
        })}
      >
        <img
          alt=""
          aria-hidden="true"
          className={css({ height: "1.25em", verticalAlign: "-0.25em", width: "1.25em" })}
          height={20}
          src="/favicon.svg"
          width={20}
        />{" "}
        Snappy
      </span>
      <p>{t("footer.tagline")}</p>
      <Link href="https://t.me/sn4ppy_bot" rel="noopener" target="_blank">
        @sn4ppy_bot
      </Link>
    </div>
  </footer>
);
