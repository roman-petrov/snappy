import { flex } from "../../../styled-system/patterns";
import { t } from "../core";
import { Pill } from "./Pill";
import { Section } from "./Section";

export const StylesSection = () => (
  <Section id="styles" lead={t("styles.lead")} title={t("styles.title")}>
    <div className={flex({ flexDirection: "column", gap: "0.5rem" })}>
      {(["styles.business", "styles.friendly", "styles.neutral", "styles.selling", "styles.humorous"] as const).map(
        key => (
          <Pill hint={t(`${key}.hint`)} key={key} name={t(`${key}.name`)} />
        ),
      )}
    </div>
  </Section>
);
