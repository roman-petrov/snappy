import { _ } from "@snappy/core";
import { $, BusyShimmerOverlay, Icon } from "@snappy/ui";
import { Wand2 } from "lucide-react";

import type { useImageCardState } from "./ImageCard.state";

import { t } from "../../locales";
import { FeedCard } from "./FeedCard";
import styles from "./ImageCard.module.scss";

export type ImageCardViewProps = ReturnType<typeof useImageCardState>;

export const ImageCardView = ({ actions, busy, pending, remove, src }: ImageCardViewProps) => (
  <FeedCard actions={actions} onRemove={remove}>
    {pending ? (
      <div className={styles.empty}>
        <span className={styles.spinner}>
          <Icon icon={Wand2} />
        </span>
        <p>{t(`feedCard.generatingImage`)}</p>
      </div>
    ) : (
      <>
        <img alt="" className={_.cn(styles.image, $.radius(`sm`))} src={src} />
        {busy ? <BusyShimmerOverlay /> : undefined}
      </>
    )}
  </FeedCard>
);
