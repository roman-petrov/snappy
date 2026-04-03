import { Alert } from "@snappy/ui";

import type { useAgentChatState } from "./AgentChat.state";

import { t } from "../../locales";
import styles from "./AgentChat.module.scss";
import { ImageCard } from "./ImageCard";
import { MessageCard } from "./MessageCard";
import { StaticForm } from "./StaticForm";

export type AgentChatViewProps = ReturnType<typeof useAgentChatState>;

export const AgentChatView = ({ error, feedItems, form, sessionStepFinished, sessionSteps }: AgentChatViewProps) => (
  <>
    <div className={styles.feed}>
      <div className={styles.uiPlanWrap}>
        <StaticForm disabled={form.disabled} onSubmit={form.onSubmit} plan={form.plan} />
      </div>
      {sessionSteps.length > 0 ? (
        <div aria-live="polite" className={styles.sessionList}>
          {sessionSteps.map(row => (
            <div className={`${styles.bubble} ${styles.sessionBubble}`} key={row.id} role="status">
              <div className={styles.sessionRow}>
                {sessionStepFinished(row.id) ? (
                  <span aria-hidden className={styles.sessionCheck}>
                    ✓
                  </span>
                ) : (
                  <span aria-hidden className={styles.sessionSpinner} />
                )}
                <p className={styles.bubbleText}>{t(`chat.tool.${row.kind}`)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : undefined}
      {feedItems.map(item =>
        item.imageSrc === undefined ? (
          item.text === `` ? undefined : (
            <MessageCard html={item.text} key={item.id} />
          )
        ) : (
          <ImageCard key={item.id} src={item.imageSrc} />
        ),
      )}
    </div>
    {error === `` ? undefined : <Alert text={error} variant="error" />}
  </>
);
