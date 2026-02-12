import { t } from "./Locale";
import { Section } from "./Section";
import { Steps } from "./Steps";

const STEP_KEYS = [`start.step1`, `start.step2`, `start.step3`, `start.step4`] as const;

export const Start = () => (
  <Section id="start" lead={t(`start.lead`)} title={t(`start.title`)}>
    <Steps items={STEP_KEYS.map(k => t(k))} />
  </Section>
);
