import { css } from "../../../styled-system/css";
import { t } from "../core";
import { FaqItem } from "./FaqItem";
import { Section } from "./Section";

export const Faq = () => (
  <Section id="faq" lead={t("faq.lead")} title={t("faq.title")}>
    <dl className={css({ display: "grid", gap: "1rem", listStyle: "none", margin: 0, padding: 0 })}>
      {(["faq.free", "faq.registration", "faq.languages", "faq.privacy", "faq.length", "faq.difference"] as const).map(
        key => (
          <FaqItem answer={t(`${key}.a`)} key={key} question={t(`${key}.q`)} />
        ),
      )}
    </dl>
  </Section>
);
