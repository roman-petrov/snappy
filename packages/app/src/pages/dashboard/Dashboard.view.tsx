import type { ApiPreset, PresetGroupId } from "@snappy/server-api";

import type { useDashboardState } from "./Dashboard.state";

import { Page } from "../../components";
import { t } from "../../core";
import { Limit } from "../chat/components";
import { PresetCard } from "./components";
import styles from "./Dashboard.module.scss";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

const groupTitleKey = (groupId: PresetGroupId): string => `dashboard.presets.groups.${groupId}`;

export const DashboardView = ({
  byGroup,
  groupOrder,
  initLoading,
  limitReached,
  onPick,
  presetId,
}: DashboardViewProps) => {
  const freePreset: ApiPreset = {
    description: t(`dashboard.presets.freeModeDescription`),
    emoji: `🪄`,
    group: `text`,
    id: `free`,
    prompt: ``,
    title: t(`dashboard.presets.freeModeTitle`),
  };

  return initLoading ? undefined : limitReached ? (
    <Limit />
  ) : (
    <Page title={undefined}>
      <div className={styles.startPage}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>Snappy</p>
            <h2 className={styles.heroTitle}>{t(`dashboard.presets.heroTitle`)}</h2>
            <p className={styles.heroLead}>{t(`dashboard.presets.heroLead`)}</p>
          </div>
          <span aria-hidden className={styles.heroEmoji}>
            🪄
          </span>
        </header>

        <PresetCard onPick={onPick} preset={freePreset} selected={presetId === freePreset.id} variant="free" />

        {groupOrder.map(groupId => {
          const items = byGroup.get(groupId) ?? [];

          return items.length === 0 ? undefined : (
            <section className={styles.presetSection} key={groupId}>
              <h3 className={styles.sectionTitle}>{t(groupTitleKey(groupId))}</h3>
              <div className={styles.presetGrid}>
                {items.map(preset => (
                  <PresetCard
                    key={preset.id}
                    onPick={onPick}
                    preset={preset}
                    selected={presetId === preset.id}
                    variant="grid"
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Page>
  );
};
