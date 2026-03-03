import { t } from "../core";
import { Block, Dl } from "./Block";
import { Section } from "./Section";

export const Faq = () => (
  <Section id="faq" lead={t(`faq.lead`)} title={t(`faq.title`)}>
    <Dl>
      {([`faq.free`, `faq.registration`, `faq.languages`, `faq.privacy`, `faq.length`, `faq.difference`] as const).map(
        key => (
          <Block description={t(`${key}.a`)} key={key} title={t(`${key}.q`)} withDivider />
        ),
      )}
    </Dl>
  </Section>
);
