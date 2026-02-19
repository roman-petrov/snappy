import { css } from "../../../styled-system/css";
import { CtaBlock } from "./CtaBlock";
import { Examples } from "./Examples";
import { Faq } from "./Faq";
import { Features } from "./Features";
import { SiteHeader } from "./Header";
import { Hero } from "./Hero";
import { SiteFooter } from "./SiteFooter";
import { Start } from "./Start";
import { StylesSection } from "./StylesSection";
import { Who } from "./Who";

export const Landing = () => (
  <>
    <SiteHeader />
    <main
      className={css({
        "@media (width <= 640px)": { paddingInline: "1rem" },
        "boxSizing": "border-box",
        "marginInline": "auto",
        "maxWidth": "1100px",
        "padding": "0 1.5rem 2rem",
        "width": "100%",
      })}
      id="main"
    >
      <Hero />
      <Features />
      <Examples />
      <StylesSection />
      <Who />
      <Faq />
      <Start />
      <CtaBlock />
    </main>
    <SiteFooter />
  </>
);
