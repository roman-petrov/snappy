import { t } from "../core";
import { Block, Dl } from "./Block";
import { Section } from "./Section";

export const Who = () => (
  <Section id="who" lead={t(`who.lead`)} title={t(`who.title`)}>
    <Dl>
      {[
        { icon: `📱`, key: `who.smm` as const },
        { icon: `✉️`, key: `who.emails` as const },
        { icon: `📄`, key: `who.ads` as const },
        { icon: `🎓`, key: `who.study` as const },
      ].map(({ icon, key }) => (
        <Block description={t(`${key}.desc`)} icon={icon} key={key} title={t(`${key}.title`)} withDivider />
      ))}
    </Dl>
  </Section>
);
