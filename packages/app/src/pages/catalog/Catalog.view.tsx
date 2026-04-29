import { Button } from "@snappy/ui";

import type { useCatalogState } from "./Catalog.state";

import { Page } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import styles from "./Catalog.module.scss";
import { AgentCatalog, PresetCard } from "./components";

export type CatalogViewProps = ReturnType<typeof useCatalogState>;

export const CatalogView = ({ agents }: CatalogViewProps) => (
  <Page title={t(`catalog.title`)}>
    <div className={styles.actionRow}>
      <Button link={Routes.feed} text={t(`catalog.openFeed`)} />
    </div>
    <section className={styles.snappySection}>
      <h3 className={styles.snappyHeading}>{t(`catalog.snappy.sectionTitle`)}</h3>
      <div className={styles.snappyGrid}>
        <PresetCard
          description={t(`catalog.snappy.description`)}
          emoji="💬"
          link={Routes.snappy}
          title={t(`catalog.snappy.title`)}
        />
      </div>
    </section>
    <AgentCatalog groups={agents} />
  </Page>
);
