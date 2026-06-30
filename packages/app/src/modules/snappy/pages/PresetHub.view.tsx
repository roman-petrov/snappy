import { Redirect } from "@snappy/app-router";
import { Page, RichCard, Text } from "@snappy/ui";

import type { usePresetHubState } from "./PresetHub.state";

import { BalanceTap } from "../../../components";
import { t } from "../../../core";
import { Routes } from "../../../Routes";
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
        <Text text={t(`snappy.preset.hub.lead`)} typography="large" />
        {entry.flows.map(flow => (
          <RichCard
            cn={styles.card}
            description={flow.description}
            icon={flow.icon}
            key={flow.id}
            link={Routes.snappy.preset.flow({ flowId: flow.id, presetId })}
            title={flow.title}
          />
        ))}
      </div>
    </Page>
  );
