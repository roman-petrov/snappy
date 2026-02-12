import { t } from "./Locale";
import { Section } from "./Section";
import { WhoItem } from "./WhoItem";

const WHO = [
  { icon: `📱`, key: `who.smm` as const },
  { icon: `✉️`, key: `who.emails` as const },
  { icon: `📄`, key: `who.ads` as const },
  { icon: `🎓`, key: `who.study` as const },
] as const;

export const Who = () => (
  <Section id="who" title={t(`who.title`)} lead={t(`who.lead`)}>
    <div>
      {WHO.map(({ icon, key }) => (
        <WhoItem key={key} icon={icon} title={t(`${key}.title`)} description={t(`${key}.desc`)} />
      ))}
    </div>
  </Section>
);
