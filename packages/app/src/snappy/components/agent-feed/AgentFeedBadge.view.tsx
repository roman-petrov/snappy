import { _ } from "@snappy/core";
import { $, Text } from "@snappy/ui";

import type { useAgentFeedBadgeState } from "./AgentFeedBadge.state";

import styles from "./AgentFeedBadge.module.scss";

export type AgentFeedBadgeViewProps = ReturnType<typeof useAgentFeedBadgeState>;

export const AgentFeedBadgeView = ({ hideOnSuccess, message, status, textProps }: AgentFeedBadgeViewProps) => {
  if (hideOnSuccess && status === `done`) {
    return undefined;
  }

  return (
    <span
      className={_.cn(
        styles.badge,
        $.radius(`lg`),
        $.elevation(`e2`),
        status === `running` ? $.surface(`primary`) : status === `done` ? $.surface(`success`) : $.surface(`error`),
        status === `running` ? styles.badgeRunning : undefined,
      )}
    >
      <span className={styles.status}>
        {status === `running` ? (
          <span className={styles.spinner} />
        ) : status === `done` ? (
          <span className={styles.icon}>✅</span>
        ) : (
          <span className={styles.icon}>❌</span>
        )}
      </span>
      <Text {...textProps} as="span" text={message} typography="bodyBold" />
    </span>
  );
};
