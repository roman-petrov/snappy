import { Clipboard } from "@snappy/browser";

import { FeedCard, type FeedCardProps } from "./FeedCard";
import styles from "./ImageCard.module.scss";

export type ImageCardProps = Pick<FeedCardProps, `busy` | `copyLabel` | `onRegenerate` | `regenerateLabel`> & {
  src: string;
};

export const ImageCard = ({ busy = false, copyLabel, onRegenerate, regenerateLabel, src }: ImageCardProps) => (
  <FeedCard
    busy={busy}
    copyLabel={copyLabel}
    onCopy={async () => Clipboard.copy(src)}
    onRegenerate={onRegenerate}
    regenerateLabel={regenerateLabel}
  >
    <img alt="" className={styles.image} src={src} />
  </FeedCard>
);
