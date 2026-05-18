import { _ } from "@snappy/core";
import { $, BusyShimmerOverlay, Icon } from "@snappy/ui";

import type { useImageCardState } from "./ImageCard.state";

import { FeedCard } from "./FeedCard";
import styles from "./ImageCard.module.scss";

export type ImageCardViewProps = ReturnType<typeof useImageCardState>;

export const ImageCardView = ({ actions, active, busy, empty, emptyText, src }: ImageCardViewProps) => (
  <FeedCard actions={actions} active={active}>
    {empty ? (
      <div className={styles.empty}>
        <span className={styles.spinner}>
          <Icon name="wand_stars" />
        </span>
        <p>{emptyText}</p>
      </div>
    ) : (
      <>
        <img alt="" className={_.cn(styles.image, $.radius(`sm`))} src={src} />
        {busy ? <BusyShimmerOverlay /> : undefined}
      </>
    )}
  </FeedCard>
);
