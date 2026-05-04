import { _ } from "@snappy/core";
import { Button } from "@snappy/ui";

import type { useDashboardState } from "./Dashboard.state";

import { Page } from "../../components";
import { t } from "../../core";
import { ChatCatalogOverlay } from "../catalog/components";
import styles from "./Dashboard.module.scss";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

const AgentScreen = ({
  agentScreen,
  onFeed,
  onPickAgent,
  onStop,
  pageTitle,
  presets,
}: Pick<DashboardViewProps, `agentScreen` | `onFeed` | `onPickAgent` | `onStop` | `pageTitle` | `presets`>) => (
  <Page title={pageTitle}>
    <div className={styles.root}>
      <div className={styles.actionRow}>
        <Button onClick={onFeed} text={t(`chat.feedRoute`)} />
        {agentScreen === undefined ? undefined : <Button onClick={onStop} text={t(`chat.stop`)} />}
      </div>
      <div className={styles.chatLayer}>
        {agentScreen === undefined ? (
          <ChatCatalogOverlay
            byGroup={presets.byGroup}
            groupOrder={presets.groupOrder}
            onClose={_.noop}
            onPick={onPickAgent}
          />
        ) : (
          agentScreen
        )}
      </div>
    </div>
  </Page>
);

export const DashboardView = ({ agentScreen, onFeed, onPickAgent, onStop, pageTitle, presets }: DashboardViewProps) => (
  <AgentScreen
    agentScreen={agentScreen}
    onFeed={onFeed}
    onPickAgent={onPickAgent}
    onStop={onStop}
    pageTitle={pageTitle}
    presets={presets}
  />
);
