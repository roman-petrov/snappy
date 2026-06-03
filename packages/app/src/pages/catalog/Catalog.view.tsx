import { _ } from "@snappy/core";
import { $, Button, Page, RichCard } from "@snappy/ui";

import type { useCatalogState } from "./Catalog.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import styles from "./Catalog.module.scss";

export type CatalogViewProps = ReturnType<typeof useCatalogState>;

export const CatalogView = ({ agents }: CatalogViewProps) => (
  <Page title={t(`catalog.title`)}>
    <div className={styles.root}>
      <div className={styles.head}>
        <Button link={Routes.feed} text={t(`catalog.openFeed`)} />
      </div>
      <h3 className={_.cn(styles.heading, $.typography(`h3`))}>{t(`catalog.snappy.sectionTitle`)}</h3>
      <RichCard
        description={t(`catalog.snappy.description`)}
        icon="💬"
        link={Routes.snappy}
        title={t(`catalog.snappy.title`)}
      />
      {agents.flatMap(group => [
        <h3 className={_.cn(styles.heading, $.typography(`h3`))} key={group.id}>
          {t(`catalog.groups.${group.id}`)}
        </h3>,
        ...group.items.map(agent => (
          <RichCard
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
