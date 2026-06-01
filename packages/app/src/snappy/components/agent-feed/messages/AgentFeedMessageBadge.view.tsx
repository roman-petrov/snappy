import { _ } from "@snappy/core";
import { $, Text } from "@snappy/ui";

import type { useAgentFeedMessageBadgeState } from "./AgentFeedMessageBadge.state";

import styles from "./AgentFeedMessageBadge.module.scss";

export type AgentFeedMessageBadgeViewProps = ReturnType<typeof useAgentFeedMessageBadgeState>;

export const AgentFeedMessageBadgeView = ({
  hideOnSuccess,
  message,
  status,
  textProps,
}: AgentFeedMessageBadgeViewProps) => {
  if (hideOnSuccess && status === `done`) {
    return undefined;
  }

  return (
    <span
      className={_.cn(
        styles.badge,
        $.elevation(`e2`),
        status === `running` ? $.surface(`primary`) : status === `done` ? $.surface(`success`) : $.surface(`error`),
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
      <Text {...textProps} as="span" text={message} typography="captionSm" />
    </span>
  );
};
