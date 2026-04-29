import { Clipboard, Html } from "@snappy/browser";

import { FeedCard, type FeedCardProps } from "./FeedCard";
import styles from "./TextCard.module.scss";

export type TextCardProps = Pick<FeedCardProps, `busy` | `copyLabel` | `onRegenerate` | `regenerateLabel`> & {
  html: string;
};

export const TextCard = ({ busy = false, copyLabel, html, onRegenerate, regenerateLabel }: TextCardProps) => (
  <FeedCard
    busy={busy}
    copyLabel={copyLabel}
    onCopy={async () => Clipboard.copyHtml(html)}
    onRegenerate={onRegenerate}
    regenerateLabel={regenerateLabel}
  >
    <div className={styles.richText} {...Html.text(html)} />
  </FeedCard>
);
