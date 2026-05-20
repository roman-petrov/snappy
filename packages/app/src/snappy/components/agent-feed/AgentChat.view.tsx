import { Button } from "@snappy/ui";

import type { useAgentChatState } from "./AgentChat.state";

import { t } from "../../../core";
import { Routes } from "../../../Routes";
import styles from "./AgentChat.module.scss";

export type AgentChatViewProps = ReturnType<typeof useAgentChatState>;

export const AgentChatView = ({ balanceLow, feed, showFeed, stop }: AgentChatViewProps) => (
  <div className={showFeed ? styles.root : styles.rootIdle}>
    <div className={styles.actionRow}>
      <Button onClick={stop} text={t(`agent.stop`)} />
    </div>
    {balanceLow ? (
      <div>
        <p>{t(`balance.common.lowLead`)}</p>
        <Button link={Routes.balance.topUp} text={t(`balance.topUp.cta`)} type="primary" />
      </div>
    ) : (
      showFeed && <div className={styles.main}>{feed}</div>
    )}
  </div>
);
