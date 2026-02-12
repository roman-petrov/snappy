import { t } from "./Locale";
import { Section } from "./Section";
import { WhoItem } from "./WhoItem";

export const Who = () => (
  <Section id="who" lead={t(`who.lead`)} title={t(`who.title`)}>
    <div>
      {[
        { icon: `📱`, key: `who.smm` as const },
        { icon: `✉️`, key: `who.emails` as const },
        { icon: `📄`, key: `who.ads` as const },
        { icon: `🎓`, key: `who.study` as const },
      ].map(({ icon, key }) => (
        <WhoItem description={t(`${key}.desc`)} icon={icon} key={key} title={t(`${key}.title`)} />
      ))}
    </div>
  </Section>
);
