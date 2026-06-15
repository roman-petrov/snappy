import { $, Page, RichCard } from "@snappy/ui";
import { Bot, Newspaper } from "lucide-react";

import type { useCatalogState } from "./Catalog.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import styles from "./Catalog.module.scss";
import { CatalogActionButton } from "./CatalogActionButton";

export type CatalogViewProps = ReturnType<typeof useCatalogState>;

export const CatalogView = ({ agents }: CatalogViewProps) => (
  <Page>
    <div className={styles.root}>
      <div className={styles.actions}>
        <CatalogActionButton icon={Bot} link={Routes.snappy} primary text={t(`catalog.agent.label`)} />
        <CatalogActionButton icon={Newspaper} link={Routes.feed} text={t(`catalog.feed.label`)} />
      </div>
      {agents.flatMap(group => [
        <h3 className={$.typography(`h3`)} key={group.id}>
          {t(`catalog.groups.${group.id}`)}
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
