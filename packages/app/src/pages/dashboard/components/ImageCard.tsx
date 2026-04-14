/* eslint-disable @typescript-eslint/promise-function-async */
import { Clipboard } from "@snappy/browser";

import { FeedCard, type FeedCardProps } from "./FeedCard";
import styles from "./ImageCard.module.scss";

export type ImageCardProps = Pick<FeedCardProps, `busy` | `onRegenerate`> & { src: string };

export const ImageCard = ({ busy = false, onRegenerate, src }: ImageCardProps) => (
  <FeedCard busy={busy} onCopy={() => Clipboard.copy(src)} onRegenerate={onRegenerate}>
    <img alt="" className={styles.image} src={src} />
  </FeedCard>
);
