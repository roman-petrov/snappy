import { t } from "../core";
import { Dl } from "./Block";
import { FaqItem } from "./FaqItem";
import { Section } from "./Section";

export const Faq = () => (
  <Section id="faq" lead={t(`faq.lead`)} title={t(`faq.title`)}>
    <Dl>
      {([`faq.free`, `faq.registration`, `faq.languages`, `faq.privacy`, `faq.length`, `faq.difference`] as const).map(
        key => (
          <FaqItem answer={t(`${key}.a`)} key={key} question={t(`${key}.q`)} />
        ),
      )}
    </Dl>
  </Section>
);
