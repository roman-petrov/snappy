import { $, Page, RichCard } from "@snappy/ui";

import type { useAgentsState } from "./Agents.state";

import { HeaderContent } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import styles from "./Agents.module.scss";

export type AgentsViewProps = ReturnType<typeof useAgentsState>;

export const AgentsView = ({ groups }: AgentsViewProps) => (
  <Page title={t(`tabs.agents.label`)} trailing={<HeaderContent />}>
    <div className={styles.root}>
      {groups.flatMap(group => [
        <h3 className={$.typography(`h3`)} key={group.id}>
          {t(`agents.groups.${group.id}`)}
        </h3>,
        ...group.items.map(agent => (
          <RichCard
            cn={styles.card}
            description={agent.description}
            icon={agent.emoji}
            key={agent.id}
            link={Routes.agent({ agentId: agent.id })}
            title={agent.title}
          />
        )),
      ])}
    </div>
  </Page>
);
