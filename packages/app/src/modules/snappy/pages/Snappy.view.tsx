import { Button, Icon, Page, RichCard, Text } from "@snappy/ui";
import { Sparkles } from "lucide-react";

import type { useSnappyState } from "./Snappy.state";

import { AppTags } from "../../../AppTags";
import { HeaderContent } from "../../../components";
import { t } from "../../../core";
import { Routes } from "../../../Routes";
import styles from "./Snappy.module.scss";

export type SnappyViewProps = ReturnType<typeof useSnappyState>;

export const SnappyView = ({ groups }: SnappyViewProps) => (
  <Page tab trailing={<HeaderContent />}>
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroHead}>
          <span className={styles.heroBadge}>
            <Icon icon={Sparkles} size="xl" />
          </span>
          <div className={styles.heroBody}>
            <Text text={t(`snappy.quickStart.title`)} typography="h2" />
            <Text text={t(`snappy.quickStart.lead`)} typography="large" />
          </div>
        </div>
        <Button
          cn={styles.heroAction}
          large
          link={Routes.snappy.chat}
          tag={AppTags.snappy.chat.start}
          text={t(`snappy.quickStart.cta`)}
          type="primary"
        />
      </section>
      <section className={styles.presets}>
        <div className={styles.presetsHeader}>
          <Text text={t(`snappy.presets.title`)} typography="h2" />
        </div>
        {groups.map(group => (
          <div className={styles.group} key={group.id}>
            <Text as="h3" cn={styles.groupHeader} text={t(`snappy.presets.groups.${group.id}`)} typography="h3" />
            {group.items.map(preset => (
              <RichCard
                cn={styles.card}
                description={preset.description}
                icon={preset.emoji}
                key={preset.id}
                link={Routes.snappy.preset.hub({ presetId: preset.id })}
                tag={AppTags.snappy.preset.open}
                title={preset.title}
              />
            ))}
          </div>
        ))}
      </section>
    </div>
  </Page>
);
