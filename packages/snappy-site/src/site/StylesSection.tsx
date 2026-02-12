import { t } from "./Locale";
import { Pill } from "./Pill";
import { Section } from "./Section";
import styles from "./StylesSection.module.css";

const STYLES = [`styles.business`, `styles.friendly`, `styles.neutral`, `styles.selling`, `styles.humorous`] as const;

export const StylesSection = () => (
  <Section id="styles" lead={t(`styles.lead`)} title={t(`styles.title`)}>
    <div className={styles[`pills`]}>
      {STYLES.map(key => (
        <Pill hint={t(`${key}.hint`)} key={key} name={t(`${key}.name`)} />
      ))}
    </div>
  </Section>
);
