import { CtaBlock } from "./CtaBlock";
import { Examples } from "./Examples";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Faq } from "./Faq";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./Header";
import { Start } from "./Start";
import { StylesSection } from "./StylesSection";
import { Who } from "./Who";
import styles from "./Landing.module.css";

type Props = { onThemeToggle?: () => void };

export const Landing = ({ onThemeToggle }: Props = {}) => (
  <>
    <SiteHeader onThemeToggle={onThemeToggle} />
    <main id="main" className={styles[`main`]}>
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
