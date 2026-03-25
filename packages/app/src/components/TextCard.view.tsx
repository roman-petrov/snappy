import { Html } from "@snappy/browser";
import { TextOverlayEffect } from "@snappy/ui";

import type { TextCardProps } from "./TextCard";

import styles from "./TextCard.module.scss";

export const TextCardView = ({ compact = false, loading, result }: TextCardProps) => (
  <div className={styles.wrapper}>
    <div className={`${styles.card} ${compact ? styles.cardCompact : styles.cardFull}`}>
      <div className={styles.contentAreaScroll}>
        <div className={styles.result} {...Html.text(result)} />
      </div>
      {loading ? (
        <div aria-hidden className={styles.loadingOverlay}>
          <TextOverlayEffect />
        </div>
      ) : undefined}
    </div>
  </div>
);
