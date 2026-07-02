import { AudioLines, Image, ListTodo, Palette, PenLine, ScanText } from "lucide-react";

import { t } from "../locales";
import styles from "./Capabilities.module.scss";
import { Section } from "./Section";
import { Tile } from "./Tile";

export const Capabilities = () => (
  <Section id="can" lead={t(`capabilities.lead`)} title={t(`capabilities.title`)}>
    <div className={styles.grid}>
      {(
        [
          { color: `accentViolet`, icon: Palette, key: `capabilities.images` },
          { color: `accentIndigo`, icon: Image, key: `capabilities.photo` },
          { color: `accentPlum`, icon: ScanText, key: `capabilities.recognize` },
          { color: `accentPink`, icon: AudioLines, key: `capabilities.audio` },
          { color: `accentPurple`, icon: PenLine, key: `capabilities.text` },
          { color: `accentOrange`, icon: ListTodo, key: `capabilities.plan` },
        ] as const
      ).map(({ color, icon, key }) => (
        <Tile color={color} description={t(`${key}.desc`)} icon={icon} key={key} title={t(`${key}.title`)} />
      ))}
    </div>
  </Section>
);
