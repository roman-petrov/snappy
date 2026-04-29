import type { AgentCard, AgentGroupId } from "@snappy/snappy-sdk";

import { t } from "../../../core";
import { Routes } from "../../../Routes";
import styles from "./AgentCatalog.module.scss";
import { PresetCard } from "./PresetCard";

export type AgentCatalogProps = { groups: readonly { id: AgentGroupId; items: readonly AgentCard[] }[] };

export const AgentCatalog = ({ groups }: AgentCatalogProps) => (
  <section className={styles.root}>
    {groups.map(group => (
      <section className={styles.section} key={group.id}>
        <h3 className={styles.sectionTitle}>{t(`catalog.groups.${group.id}`)}</h3>
        <div className={styles.grid}>
          {group.items.map(agent => (
            <PresetCard
              description={agent.description}
              emoji={agent.emoji}
              key={agent.id}
              link={Routes.agent(agent.id)}
              title={agent.title}
            />
          ))}
        </div>
      </section>
    ))}
  </section>
);
