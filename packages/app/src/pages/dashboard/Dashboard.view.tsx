import { Button } from "@snappy/ui";

import type { useDashboardState } from "./Dashboard.state";

import { Page } from "../../components";
import { t } from "../../core";
import { ChatCatalogOverlay, ChatFeedView } from "./components";
import styles from "./Dashboard.module.scss";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

export const DashboardView = ({
  activeSession,
  agentRunning,
  catalogOpen,
  onCloseCatalog,
  onOpenCatalog,
  onPickAgent,
  onRejectUi,
  onRemoveSession,
  onResolveUi,
  onStop,
  pendingUi,
  presets,
  regenerateArtifact,
  regeneratingMessageIds,
  sessions,
}: DashboardViewProps) => (
  <Page>
    <div className={styles.root}>
      {agentRunning ? undefined : (
        <div className={styles.actionRow}>
          <Button onClick={onOpenCatalog} text={t(`chat.openCatalog`)} />
        </div>
      )}
      <div className={styles.chatLayer}>
        <ChatFeedView
          activeSession={activeSession}
          onRejectUi={onRejectUi}
          onRemoveSession={onRemoveSession}
          onResolveUi={onResolveUi}
          onStopSession={onStop}
          pendingUi={pendingUi}
          regenerateArtifact={regenerateArtifact}
          regeneratingMessageIds={regeneratingMessageIds}
          sessions={sessions}
        />
      </div>
      {catalogOpen ? (
        <div className={styles.overlayLayer}>
          <div className={styles.overlayScroll}>
            <ChatCatalogOverlay
              byGroup={presets.byGroup}
              groupOrder={presets.groupOrder}
              onClose={onCloseCatalog}
              onPick={onPickAgent}
            />
          </div>
        </div>
      ) : undefined}
    </div>
  </Page>
);
