import { t } from "../core/Locale";
import { Section } from "./Section";
import { Steps } from "./Steps";

export const Start = () => (
  <Section id="start" lead={t(`start.lead`)} title={t(`start.title`)}>
    <Steps items={([`start.step1`, `start.step2`, `start.step3`, `start.step4`] as const).map(key => t(key))} />
  </Section>
);
