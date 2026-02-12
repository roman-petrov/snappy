import { t } from "./Locale";
import { FaqItem } from "./FaqItem";
import { Section } from "./Section";
import styles from "./Faq.module.css";

const FAQ = [
  `faq.free`,
  `faq.registration`,
  `faq.languages`,
  `faq.privacy`,
  `faq.length`,
  `faq.difference`,
] as const;

export const Faq = () => (
  <Section id="faq" title={t(`faq.title`)} lead={t(`faq.lead`)}>
    <dl className={styles[`list`]}>
      {FAQ.map((key) => (
        <FaqItem key={key} question={t(`${key}.q`)} answer={t(`${key}.a`)} />
      ))}
    </dl>
  </Section>
);
