import { ListChecks, MessageSquare } from "lucide-react";

import { t } from "../locales";
import styles from "./Modes.module.scss";
import { Section } from "./Section";
import { Tile } from "./Tile";

export const Modes = () => (
  <Section lead={t(`modes.lead`)} title={t(`modes.title`)}>
    <div className={styles.grid}>
      <Tile
        color="accentIndigo"
        description={t(`modes.chat.desc`)}
        icon={MessageSquare}
        title={t(`modes.chat.title`)}
      />
      <Tile color="accentViolet" description={t(`modes.form.desc`)} icon={ListChecks} title={t(`modes.form.title`)} />
    </div>
  </Section>
);
