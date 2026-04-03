import type { AgentGroupId } from "@snappy/agents";

import type { useDashboardState } from "./Dashboard.state";

import { Page } from "../../components";
import { t } from "../../core";
import { PresetCard } from "./components";
import styles from "./Dashboard.module.scss";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

const groupTitleKey = (groupId: AgentGroupId): string => `dashboard.presets.groups.${groupId}`;

export const DashboardView = ({ blockShell, byGroup, groupOrder, initLoading, onPick }: DashboardViewProps) =>
  initLoading || blockShell ? undefined : (
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

        {groupOrder.map(groupId => {
          const items = byGroup.get(groupId) ?? [];

          return items.length === 0 ? undefined : (
            <section className={styles.presetSection} key={groupId}>
              <h3 className={styles.sectionTitle}>{t(groupTitleKey(groupId))}</h3>
              <div className={styles.presetGrid}>
                {items.map(agent => (
                  <PresetCard
                    description={agent.description}
                    emoji={agent.emoji}
                    key={agent.id}
                    onClick={() => onPick(agent.id)}
                    title={agent.title}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Page>
  );
