import styles from "./Faq.module.css";
import { FaqItem } from "./FaqItem";
import { t } from "./Locale";
import { Section } from "./Section";

export const Faq = () => (
  <Section id="faq" lead={t(`faq.lead`)} title={t(`faq.title`)}>
    <dl className={styles[`list`]}>
      {([`faq.free`, `faq.registration`, `faq.languages`, `faq.privacy`, `faq.length`, `faq.difference`] as const).map(
        key => (
          <FaqItem answer={t(`${key}.a`)} key={key} question={t(`${key}.q`)} />
        ),
      )}
    </dl>
  </Section>
);
