import { Button } from "@snappy/ui";

import type { useAgentChatState } from "./AgentChat.state";

import { t } from "../../../../core";
import { Routes } from "../../../../Routes";
import styles from "./AgentChat.module.scss";

export type AgentChatViewProps = ReturnType<typeof useAgentChatState>;

export const AgentChatView = ({ balanceLow, feed, showFeed }: AgentChatViewProps) => (
  <div className={showFeed ? styles.root : styles.rootIdle}>
    {balanceLow ? (
      <div>
        <p>{t(`balance.common.lowLead`)}</p>
        <Button link={Routes.settings.profile.topUp} text={t(`settings.profile.topUp.cta`)} type="primary" />
      </div>
    ) : (
      showFeed && <div className={styles.main}>{feed}</div>
    )}
  </div>
);
