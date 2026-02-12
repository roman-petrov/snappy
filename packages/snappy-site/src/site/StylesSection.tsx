import { t } from "./Locale";
import { Pill } from "./Pill";
import { Section } from "./Section";
import styles from "./StylesSection.module.css";

const STYLES = [
  `styles.business`,
  `styles.friendly`,
  `styles.neutral`,
  `styles.selling`,
  `styles.humorous`,
] as const;

export const StylesSection = () => (
  <Section id="styles" title={t(`styles.title`)} lead={t(`styles.lead`)}>
    <div className={styles[`pills`]}>
      {STYLES.map((key) => (
        <Pill key={key} name={t(`${key}.name`)} hint={t(`${key}.hint`)} />
      ))}
    </div>
  </Section>
);
