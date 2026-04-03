import { Html } from "@snappy/browser";

import { FeedCard } from "./FeedCard";
import styles from "./MessageCard.module.scss";

export type MessageCardProps = { html: string };

export const MessageCard = ({ html }: MessageCardProps) => (
  <FeedCard>
    <div className={styles.richText} {...Html.text(html)} />
  </FeedCard>
);
