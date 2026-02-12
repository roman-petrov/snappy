import { FeatureCard } from "./FeatureCard";
import styles from "./Features.module.css";
import { t } from "./Locale";
import { Section } from "./Section";

const FEATURES = [
  { descKey: `features.fixErrors.desc` as const, icon: `📝`, titleKey: `features.fixErrors.title` as const },
  { descKey: `features.shorten.desc` as const, icon: `✂️`, titleKey: `features.shorten.title` as const },
  { descKey: `features.expand.desc` as const, icon: `📖`, titleKey: `features.expand.title` as const },
  { descKey: `features.readability.desc` as const, icon: `👁️`, titleKey: `features.readability.title` as const },
  { descKey: `features.emoji.desc` as const, icon: `😊`, titleKey: `features.emoji.title` as const },
  { descKey: `features.styles.desc` as const, icon: `🎭`, titleKey: `features.styles.title` as const },
] as const;

export const Features = () => (
  <Section id="features" lead={t(`features.lead`)} title={t(`features.title`)}>
    <div className={styles[`grid`]}>
      {FEATURES.map(({ descKey, icon, titleKey }) => (
        <FeatureCard description={t(descKey)} icon={icon} key={titleKey} title={t(titleKey)} />
      ))}
    </div>
  </Section>
);
