import { CtaBlock } from "./CtaBlock";
import { Examples } from "./Examples";
import { Faq } from "./Faq";
import { Features } from "./Features";
import { SiteHeader } from "./Header";
import { Hero } from "./Hero";
import styles from "./Landing.module.css";
import { SiteFooter } from "./SiteFooter";
import { Start } from "./Start";
import { StylesSection } from "./StylesSection";
import { Who } from "./Who";

export const Landing = () => (
  <>
    <SiteHeader />
    <main className={styles[`main`]} id="main">
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
