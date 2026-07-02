import { _ } from "@snappy/core";
import { $ } from "@snappy/ui";
import { CheckCheck, Languages, LayoutGrid, Lightbulb, ShieldCheck, Smartphone } from "lucide-react";

import { t } from "../locales";
import { FeatureList } from "./FeatureList";
import { Section } from "./Section";
import styles from "./Why.module.scss";

export const Why = () => (
  <Section lead={t(`why.lead`)} title={t(`why.title`)}>
    <div className={_.cn(styles.panel, $.surface(`surfaceGlass`), $.radius(`lg`))}>
      <FeatureList
        items={[
          { color: `accentViolet`, description: t(`why.one.desc`), icon: LayoutGrid, title: t(`why.one.title`) },
          { color: `accentOrange`, description: t(`why.ask.desc`), icon: Lightbulb, title: t(`why.ask.title`) },
          { color: `accentIndigo`, description: t(`why.ready.desc`), icon: CheckCheck, title: t(`why.ready.title`) },
          { color: `accentPink`, description: t(`why.ru.desc`), icon: Languages, title: t(`why.ru.title`) },
          {
            color: `accentPurple`,
            description: t(`why.privacy.desc`),
            icon: ShieldCheck,
            title: t(`why.privacy.title`),
          },
          { color: `accentPlum`, description: t(`why.cross.desc`), icon: Smartphone, title: t(`why.cross.title`) },
        ]}
      />
    </div>
  </Section>
);
