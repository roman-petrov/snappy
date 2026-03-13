import { Text, TextOverlayEffect } from "@snappy/ui";

import type { useTextCardState } from "./TextCard.state";

import styles from "./TextCard.module.scss";

export type TextCardViewProps = ReturnType<typeof useTextCardState>;

export const TextCardView = ({
  cardSizeKey,
  cardVariantKey,
  contentAreaKey,
  contentVariant,
  loading,
  onTextChange,
  placeholder,
  result,
  showOverlay,
  text,
  wrapperVariant,
}: TextCardViewProps) => (
  <div className={styles.wrapper} data-variant={wrapperVariant}>
    <div className={`${styles.card} ${styles[cardSizeKey]} ${styles[cardVariantKey]}`}>
      <div className={styles[contentAreaKey]}>
        {contentVariant === `result` ? (
          <Text as="div" cn={styles.result} text={result} typography="large" />
        ) : (
          <textarea
            className={styles.textarea}
            disabled={loading}
            onChange={event => onTextChange(event.currentTarget.value)}
            placeholder={placeholder}
            value={text}
          />
        )}
      </div>
      {showOverlay ? (
        <div aria-hidden className={styles.loadingOverlay}>
          <TextOverlayEffect />
        </div>
      ) : undefined}
    </div>
  </div>
);
