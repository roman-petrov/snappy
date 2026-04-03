/* eslint-disable no-void */
import { Endpoints } from "@snappy/server-api";
import { Alert, Button, TextInput } from "@snappy/ui";

import type { useChatState } from "./Chat.state";

import { Page } from "../../components";
import { t } from "../../core";
import styles from "./Chat.module.scss";
import { Limit } from "./components";
import { UiPlanForm } from "./components/UiPlanForm";

export type ChatViewProps = ReturnType<typeof useChatState>;

export const ChatView = ({
  error,
  feedBubbles,
  initLoading,
  limitReached,
  loading,
  pendingUi,
  presetId,
  sendMessage,
  setText,
  submitUi,
  text,
}: ChatViewProps) =>
  initLoading ? undefined : limitReached ? (
    <Limit />
  ) : (
    <Page back overflowVisible title={undefined}>
      {pendingUi === undefined ? undefined : (
        <div className={styles.uiPlanWrap}>
          <UiPlanForm disabled={loading} onSubmit={submitUi} plan={pendingUi.plan} />
        </div>
      )}
      {loading ? (
        <div aria-live="polite" className={styles.modelProgress} role="status">
          <div className={styles.modelProgressTrack}>
            <div className={styles.modelProgressBar} />
          </div>
          <p className={styles.modelProgressText}>{t(`dashboard.agent.modelWorking`)}</p>
        </div>
      ) : undefined}
      <div className={`${styles.feed} ${styles.scroll}`}>
        {feedBubbles.map(bubble => (
          <div className={styles.bubble} key={bubble.id}>
            {bubble.imageFileId === undefined ? (
              bubble.text === `` ? undefined : (
                <p className={styles.bubbleText}>{bubble.text}</p>
              )
            ) : (
              <img alt="" className={styles.image} src={Endpoints.files.download(bubble.imageFileId)} />
            )}
          </div>
        ))}
      </div>
      {presetId === `free` ? (
        <div className={styles.composer}>
          <div className={styles.composerRow}>
            <div className={styles.composerInputWrap}>
              <TextInput
                disabled={loading || pendingUi !== undefined}
                maxLines={8}
                onChange={setText}
                placeholder={t(`dashboard.agent.placeholder`)}
                value={text}
              />
            </div>
            <Button
              disabled={loading || pendingUi !== undefined || text.trim() === ``}
              onClick={() => void sendMessage()}
              text={t(`dashboard.agent.send`)}
              type="primary"
            />
          </div>
          {error === `` ? undefined : <Alert text={error} variant="error" />}
        </div>
      ) : error === `` ? undefined : (
        <Alert text={error} variant="error" />
      )}
    </Page>
  );
