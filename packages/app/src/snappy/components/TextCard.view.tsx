import { Html } from "@snappy/browser";
import { StreamingText } from "@snappy/ui";

import type { useTextCardState } from "./TextCard.state";

import { FeedCard } from "./FeedCard";
import styles from "./TextCard.module.scss";

export type TextCardViewProps = ReturnType<typeof useTextCardState>;

export const TextCardView = ({ actions, active, html, stream }: TextCardViewProps) => (
  <FeedCard actions={actions} active={active}>
    {stream === undefined ? (
      <div className={styles.richText} {...Html.text(html)} />
    ) : (
      <div className={styles.richText}>
        <StreamingText color="text" stream={stream} typography="body" />
      </div>
    )}
  </FeedCard>
);
