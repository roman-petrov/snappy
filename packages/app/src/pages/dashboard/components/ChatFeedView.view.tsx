import { Button } from "@snappy/ui";
import { createElement } from "react";

import type { SessionCardView, useChatFeedViewState } from "./ChatFeedView.state";

import { t } from "../../../core";
import styles from "./ChatFeedView.module.scss";
import { ImageCard } from "./ImageCard";
import { MessageLine } from "./MessageLine";
import { TextCard } from "./TextCard";

export type ChatFeedViewViewProps = ReturnType<typeof useChatFeedViewState>;

const SessionCard = ({
  card,
  onRejectUi,
  onResolveUi,
}: {
  card: SessionCardView;
  onRejectUi: ChatFeedViewViewProps[`onRejectUi`];
  onResolveUi: ChatFeedViewViewProps[`onResolveUi`];
}) => (
  <article
    className={`${styles.session} ${
      card.status === `running`
        ? styles.sessionRunning
        : card.status === `error`
          ? styles.sessionError
          : card.status === `stopped`
            ? styles.sessionStopped
            : styles.sessionDone
    }`}
  >
    <header className={styles.sessionHeader}>
      <h3 className={styles.sessionTitle}>
        {`${card.agentEmoji === undefined || card.agentEmoji === `` ? `` : `${card.agentEmoji} `}${card.agentName}`}
      </h3>
      <div className={styles.sessionActions}>
        {card.canStop ? <Button onClick={card.onStop} text={t(`chat.stop`)} /> : undefined}
        {card.canStop ? undefined : <Button onClick={card.onRemove} text="Del" />}
      </div>
    </header>
    <div className={styles.sessionBody}>
      {card.entries.map(item => {
        if (item.type === `image`) {
          return <ImageCard busy={item.busy} key={item.id} onRegenerate={item.regenerate} src={item.src} />;
        }
        if (item.type === `text`) {
          return <TextCard busy={item.busy} html={item.html} key={item.id} onRegenerate={item.regenerate} />;
        }

        const toolLabel =
          item.tool === `chat` || item.tool === `image` || item.tool === `speechRecognition`
            ? t(`chat.feed.tool.${item.tool}`)
            : item.tool;

        const chatFeedText =
          item.text === `chat.feed.chat.pending`
            ? `chat.pending`
            : item.text === `chat.feed.chat.done`
              ? `chat.done`
              : item.text === `chat.feed.image.pending`
                ? `image.pending`
                : item.text === `chat.feed.image.done`
                  ? `image.done`
                  : item.text === `chat.feed.speechRecognition.pending`
                    ? `speechRecognition.pending`
                    : item.text === `chat.feed.speechRecognition.done`
                      ? `speechRecognition.done`
                      : undefined;

        const textLabel =
          chatFeedText === undefined
            ? item.text === `balanceBlocked`
              ? t(`chat.feed.error.balanceBlocked`)
              : item.text === `request_failed`
                ? t(`chat.feed.error.requestFailed`)
                : item.text
            : t(`chat.feed.${chatFeedText}`);

        return <MessageLine cost={item.cost} key={item.id} status={item.status} text={`${toolLabel} · ${textLabel}`} />;
      })}
      {card.pendingUi === undefined
        ? undefined
        : createElement(card.pendingUi.component, {
            ...card.pendingUi.props,
            onReject: onRejectUi,
            onResolve: onResolveUi,
          })}
    </div>
  </article>
);

export const ChatFeedViewView = ({ activeCard, onRejectUi, onResolveUi, sessionCards }: ChatFeedViewViewProps) => (
  <section className={styles.root}>
    {activeCard === undefined ? undefined : (
      <SessionCard card={activeCard} onRejectUi={onRejectUi} onResolveUi={onResolveUi} />
    )}
    {sessionCards.map(card => (
      <SessionCard card={card} key={card.sessionId ?? `active`} onRejectUi={onRejectUi} onResolveUi={onResolveUi} />
    ))}
  </section>
);
