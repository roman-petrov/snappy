import { Button } from "@snappy/ui";

import { css } from "../../../styled-system/css";
import { t } from "../core";
import { cta } from "./CtaButton.styles";

export const Hero = () => (
  <section
    className={css({
      "@media (width <= 640px)": { paddingBlock: "4rem 1.5rem" },
      "paddingBlock": "6rem 1.5rem",
      "position": "relative",
      "textAlign": "center",
    })}
  >
    <h1
      className={css({
        "@media (width <= 640px)": { fontSize: "clamp(1.875rem, 7vw, 2.75rem)" },
        "color": "text.heading",
        "fontSize": "hero",
        "fontWeight": "extrabold",
        "letterSpacing": "tight",
        "lineHeight": "tight",
        "margin": "0 0 1.25rem",
        "position": "relative",
      })}
    >
      {t("hero.title")}
    </h1>
    <p
      className={css({
        "& strong": { color: "accent" },
        "@media (width <= 640px)": { fontSize: "base", marginBottom: "2rem" },
        "color": "text.body",
        "fontSize": "xl",
        "lineHeight": "relaxed",
        "margin": "0 auto 2.5rem",
        "maxWidth": "36rem",
      })}
    >
      {t("hero.lead")}
    </p>
    <Button cn={cta} href="https://t.me/sn4ppy_bot" icon="telegram" large primary>
      {t("hero.cta")}
    </Button>
  </section>
);
