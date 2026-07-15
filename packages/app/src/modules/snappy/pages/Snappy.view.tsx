import { Page, RichCard, Text } from "@snappy/ui";

import type { useSnappyState } from "./Snappy.state";

import { AppTags } from "../../../AppTags";
import { TabHeaderContent } from "../../../components";
import { t } from "../../../core";
import { Routes } from "../../../Routes";
import { QuickStartTap } from "../components";
import styles from "./Snappy.module.scss";

export type SnappyViewProps = ReturnType<typeof useSnappyState>;

export const SnappyView = ({ groups }: SnappyViewProps) => (
  <Page tab trailing={<TabHeaderContent />}>
    <div className={styles.root}>
      <QuickStartTap />
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
                emoji={preset.emoji}
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
