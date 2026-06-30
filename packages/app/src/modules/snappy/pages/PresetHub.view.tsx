import { Redirect } from "@snappy/app-router";
import { Page, Text } from "@snappy/ui";

import type { usePresetHubState } from "./PresetHub.state";

import { BalanceTap } from "../../../components";
import { t } from "../../../core";
import { Routes } from "../../../Routes";
import { PresetFlowTap } from "../components/PresetFlowTap";
import { PresetMetaPageTitle } from "../components/PresetMetaPageTitle";
import styles from "./PresetHub.module.scss";

export type PresetHubViewProps = ReturnType<typeof usePresetHubState>;

export const PresetHubView = ({ entry, invalid, presetId }: PresetHubViewProps) =>
  invalid || entry === undefined ? (
    <Redirect to={Routes.$.home} />
  ) : (
    <Page
      back
      title={<PresetMetaPageTitle emoji={entry.meta.emoji} title={entry.meta.title} />}
      trailing={<BalanceTap />}
    >
      <div className={styles.root}>
        <header className={styles.intro}>
          <Text text={t(`snappy.preset.hub.title`)} typography="h2" />
          <Text text={t(`snappy.preset.hub.lead`)} typography="large" />
        </header>
        <div className={styles.flows}>
          {entry.flows.map(({ description, icon, id, title }) => (
            <PresetFlowTap
              description={description}
              emoji={icon}
              key={id}
              link={Routes.snappy.preset.flow({ flowId: id, presetId })}
              title={title}
              tone={id === `snappy` ? `fuchsia` : `orange`}
            />
          ))}
        </div>
      </div>
    </Page>
  );
