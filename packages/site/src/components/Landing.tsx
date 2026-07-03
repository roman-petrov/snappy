import { Page } from "@snappy/ui";

import { Capabilities } from "./Capabilities";
import { Compare } from "./Compare";
import { Concept } from "./Concept";
import { CookieBanner } from "./CookieBanner";
import { CtaBlock } from "./CtaBlock";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Modes } from "./Modes";
import { Presets } from "./Presets";
import { Who } from "./Who";
import { Why } from "./Why";

export const Landing = () => (
  <Page>
    <main id="main">
      <Hero />
      <Concept />
      <Capabilities />
      <Presets />
      <Modes />
      <Who />
      <Why />
      <Compare />
      <CtaBlock />
    </main>
    <Footer />
    <CookieBanner />
  </Page>
);
