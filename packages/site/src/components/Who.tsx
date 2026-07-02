import { Briefcase, GraduationCap, Heart, Megaphone, ShoppingBag } from "lucide-react";

import { t } from "../locales";
import { FeatureList } from "./FeatureList";
import { Section } from "./Section";

export const Who = () => (
  <Section id="who" lead={t(`who.lead`)} title={t(`who.title`)}>
    <FeatureList
      items={[
        { color: `accentIndigo`, description: t(`who.business.desc`), icon: Briefcase, title: t(`who.business.title`) },
        { color: `accentOrange`, description: t(`who.sellers.desc`), icon: ShoppingBag, title: t(`who.sellers.title`) },
        { color: `accentPink`, description: t(`who.smm.desc`), icon: Megaphone, title: t(`who.smm.title`) },
        { color: `accentViolet`, description: t(`who.study.desc`), icon: GraduationCap, title: t(`who.study.title`) },
        { color: `accentFuchsia`, description: t(`who.personal.desc`), icon: Heart, title: t(`who.personal.title`) },
      ]}
    />
  </Section>
);
