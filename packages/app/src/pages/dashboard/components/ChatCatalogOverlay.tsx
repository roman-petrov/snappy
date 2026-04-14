import type { AgentCard, AgentGroupId } from "@snappy/agents";

import { Button } from "@snappy/ui";

import { t } from "../../../core";
import styles from "./ChatCatalogOverlay.module.scss";
import { PresetCard } from "./PresetCard";

export type ChatCatalogOverlayProps = {
  byGroup: ReadonlyMap<AgentGroupId, readonly AgentCard[]>;
  groupOrder: readonly AgentGroupId[];
  onClose: () => void;
  onPick: (id: string) => void;
};

const groupTitleKey = (groupId: AgentGroupId): string => `dashboard.presets.groups.${groupId}`;

export const ChatCatalogOverlay = ({ byGroup, groupOrder, onClose, onPick }: ChatCatalogOverlayProps) => (
  <section className={styles.overlay}>
    <div className={styles.content}>
      <div className={styles.head}>
        <h2 className={styles.title}>{t(`chat.catalog`)}</h2>
        <Button onClick={onClose} text="×" />
      </div>
      {groupOrder.map(groupId => {
        const items = byGroup.get(groupId) ?? [];

        return items.length === 0 ? undefined : (
          <section className={styles.section} key={groupId}>
            <h3 className={styles.sectionTitle}>{t(groupTitleKey(groupId))}</h3>
            <div className={styles.grid}>
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
  </section>
);
