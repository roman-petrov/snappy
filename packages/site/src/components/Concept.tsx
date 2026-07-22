import { Lightbulb } from "lucide-react";

import { t } from "../locales";
import { HintPanel } from "./HintPanel";
import { Section } from "./Section";
import { Steps } from "./Steps";

export const Concept = () => (
  <Section id="how" lead={t(`concept.lead`)} title={t(`concept.title`)}>
    <Steps items={[t(`concept.step1`), t(`concept.step2`), t(`concept.step3`)]} />
    <HintPanel
      color="accentViolet"
      description={t(`concept.hintText`)}
      icon={Lightbulb}
      title={t(`concept.hintTitle`)}
    />
  </Section>
);
