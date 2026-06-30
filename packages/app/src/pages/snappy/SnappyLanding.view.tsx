import { Button, Icon, Page, RichCard, Text } from "@snappy/ui";
import { Sparkles } from "lucide-react";

import type { useSnappyLandingState } from "./SnappyLanding.state";

import { HeaderContent } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import { SnappyChatBlankPresetId } from "./chat";
import styles from "./SnappyLanding.module.scss";

export type SnappyLandingViewProps = ReturnType<typeof useSnappyLandingState>;

export const SnappyLandingView = ({ groups }: SnappyLandingViewProps) => (
  <Page tab trailing={<HeaderContent />}>
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroHead}>
          <span className={styles.heroBadge}>
            <Icon icon={Sparkles} size="xl" />
          </span>
          <div className={styles.heroBody}>
            <Text text={t(`snappy.landing.quickStart.title`)} typography="h2" />
            <Text text={t(`snappy.landing.quickStart.lead`)} typography="large" />
          </div>
        </div>
        <Button
          cn={styles.heroAction}
          large
          link={Routes.chat({ presetId: SnappyChatBlankPresetId })}
          text={t(`snappy.landing.quickStart.cta`)}
          type="primary"
        />
      </section>
      <section className={styles.presets}>
        <div className={styles.presetsHeader}>
          <Text text={t(`snappy.landing.presets.title`)} typography="h2" />
        </div>
        {groups.flatMap(group => [
          <Text key={group.id} text={t(`snappy.presets.groups.${group.id}`)} typography="h3" />,
          ...group.items.map(preset => (
            <RichCard
              cn={styles.card}
              description={preset.description}
              icon={preset.emoji}
              key={preset.id}
              link={preset.hasStatic ? Routes.preset({ presetId: preset.id }) : Routes.chat({ presetId: preset.id })}
              title={preset.title}
            />
          )),
        ])}
      </section>
    </div>
  </Page>
);
