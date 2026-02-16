import { t } from "../core";
import { Pill } from "./Pill";
import { Section } from "./Section";
import styles from "./StylesSection.module.css";

export const StylesSection = () => (
  <Section id="styles" lead={t(`styles.lead`)} title={t(`styles.title`)}>
    <div className={styles.pills}>
      {([`styles.business`, `styles.friendly`, `styles.neutral`, `styles.selling`, `styles.humorous`] as const).map(
        key => (
          <Pill hint={t(`${key}.hint`)} key={key} name={t(`${key}.name`)} />
        ),
      )}
    </div>
  </Section>
);
