/* eslint-disable @typescript-eslint/promise-function-async */
import { Clipboard, Html } from "@snappy/browser";

import { FeedCard, type FeedCardProps } from "./FeedCard";
import styles from "./TextCard.module.scss";

export type TextCardProps = Pick<FeedCardProps, `busy` | `onRegenerate`> & { html: string };

export const TextCard = ({ busy = false, html, onRegenerate }: TextCardProps) => (
  <FeedCard busy={busy} onCopy={() => Clipboard.copyHtml(html)} onRegenerate={onRegenerate}>
    <div className={styles.richText} {...Html.text(html)} />
  </FeedCard>
);
