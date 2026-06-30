import { _ } from "@snappy/core";
import { $, Icon } from "@snappy/ui";
import { Wand2 } from "lucide-react";

import type { useImageCardState } from "./ImageCard.state";

import { t } from "../core";
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
      <div className={_.cn(styles.frame, $.radius(`sm`))}>
        <img alt="" className={styles.image} src={src} />
        {busy ? <div className={styles.shimmer} /> : undefined}
      </div>
    )}
  </FeedCard>
);
