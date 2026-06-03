import { Layout } from "@snappy/ui";

import { CtaBlock } from "./CtaBlock";
import { Examples } from "./Examples";
import { Faq } from "./Faq";
import { Features } from "./Features";
import { Hero } from "./Hero";
import styles from "./Landing.module.scss";
import { SiteHeader } from "./SiteHeader";
import { Start } from "./Start";
import { StylesSection } from "./StylesSection";
import { Who } from "./Who";

export const Landing = () => (
  <Layout
    content={
      <main className={styles.main} id="main">
        <Hero />
        <Features />
        <Examples />
        <StylesSection />
        <Who />
        <Faq />
        <Start />
        <CtaBlock />
      </main>
    }
    trailing={<SiteHeader />}
  />
);
