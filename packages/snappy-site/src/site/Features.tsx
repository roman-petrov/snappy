import { t } from "./Locale";
import { FeatureCard } from "./FeatureCard";
import { Section } from "./Section";
import styles from "./Features.module.css";

const FEATURES = [
  { icon: `📝`, titleKey: `features.fixErrors.title` as const, descKey: `features.fixErrors.desc` as const },
  { icon: `✂️`, titleKey: `features.shorten.title` as const, descKey: `features.shorten.desc` as const },
  { icon: `📖`, titleKey: `features.expand.title` as const, descKey: `features.expand.desc` as const },
  { icon: `👁️`, titleKey: `features.readability.title` as const, descKey: `features.readability.desc` as const },
  { icon: `😊`, titleKey: `features.emoji.title` as const, descKey: `features.emoji.desc` as const },
  { icon: `🎭`, titleKey: `features.styles.title` as const, descKey: `features.styles.desc` as const },
] as const;

export const Features = () => (
  <Section id="features" title={t(`features.title`)} lead={t(`features.lead`)}>
    <div className={styles[`grid`]}>
      {FEATURES.map(({ icon, titleKey, descKey }) => (
        <FeatureCard key={titleKey} icon={icon} title={t(titleKey)} description={t(descKey)} />
      ))}
    </div>
  </Section>
);
