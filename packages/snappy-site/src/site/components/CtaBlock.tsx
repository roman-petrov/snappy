import { Button } from "@snappy/ui";

import { css } from "../../../styled-system/css";
import { t } from "../core";
import { cta } from "./CtaButton.styles";

export const CtaBlock = () => (
  <section
    className={css({
      "@media (width <= 640px)": { _before: { insetInline: "10%" }, marginBlockStart: "2.5rem", padding: "3rem 1rem" },
      "_before": {
        background:
          "linear-gradient(to right, transparent, rgb(var(--rgb-accent) / 40%) 20%, rgb(var(--rgb-accent) / 40%) 80%, transparent)",
        content: '""',
        height: "1px",
        insetInline: "20%",
        position: "absolute",
        top: 0,
      },
      "marginBlockStart": "3rem",
      "padding": "4rem 1.5rem",
      "position": "relative",
      "textAlign": "center",
    })}
  >
    <h2
      className={css({
        "@media (width <= 640px)": { fontSize: "2xl" },
        "color": "text.heading",
        "fontSize": "3xl",
        "fontWeight": "extrabold",
        "letterSpacing": "tight",
        "margin": "0 0 0.75rem",
      })}
    >
      {t("cta.title")}
    </h2>
    <p
      className={css({
        "@media (width <= 640px)": { fontSize: "base" },
        "color": "text.muted",
        "fontSize": "lg",
        "margin": "0 auto 1.5rem",
        "maxWidth": "28rem",
      })}
    >
      {t("cta.lead")}
    </p>
    <Button cn={cta} href="https://t.me/sn4ppy_bot" icon="telegram" large primary>
      {t("cta.button")}
    </Button>
  </section>
);
