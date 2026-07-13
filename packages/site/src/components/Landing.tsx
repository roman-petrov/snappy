import { Capabilities } from "./Capabilities";
import { Compare } from "./Compare";
import { Concept } from "./Concept";
import { CtaBlock } from "./CtaBlock";
import { Hero } from "./Hero";
import { Modes } from "./Modes";
import { Presets } from "./Presets";
import { Who } from "./Who";
import { Why } from "./Why";

export const Landing = () => (
  <>
    <Hero />
    <Concept />
    <Capabilities />
    <Presets />
    <Modes />
    <Who />
    <Why />
    <Compare />
    <CtaBlock />
  </>
);
