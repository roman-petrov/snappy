import { RichCard } from "@snappy/ui";

import { t } from "../locales";
import styles from "./Features.module.scss";
import { Section } from "./Section";

export const Features = () => (
  <Section id="features" lead={t(`features.lead`)} title={t(`features.title`)}>
    <div className={styles.grid}>
      {[
        { descKey: `features.shorten.desc` as const, icon: { emoji: `✂️` }, titleKey: `features.shorten.title` as const },
        { descKey: `features.expand.desc` as const, icon: { emoji: `📖` }, titleKey: `features.expand.title` as const },
        { descKey: `features.readability.desc` as const, icon: { emoji: `👁️` }, titleKey: `features.readability.title` as const },
        { descKey: `features.emoji.desc` as const, icon: { emoji: `😊` }, titleKey: `features.emoji.title` as const },
        { descKey: `features.styles.desc` as const, icon: { emoji: `🎭` }, titleKey: `features.styles.title` as const },
      ].map(({ descKey, icon, titleKey }) => (
        <RichCard description={t(descKey)} icon={icon} key={titleKey} title={t(titleKey)} />
      ))}
    </div>
  </Section>
);
