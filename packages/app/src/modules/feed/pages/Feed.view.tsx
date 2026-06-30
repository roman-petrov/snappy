import { Page } from "@snappy/ui";

import type { useFeedState } from "./Feed.state";

import { HeaderContent, ImageCard, TextCard } from "../../../components";
import { t } from "../../../core";
import styles from "./Feed.module.scss";

export type FeedViewProps = ReturnType<typeof useFeedState>;

export const FeedView = ({ cards, sentinelRef }: FeedViewProps) => (
  <Page tab title={t(`feed.title`)} trailing={<HeaderContent />}>
    <div className={styles.root}>
      <div className={styles.cards}>
        {cards?.map(card =>
          card.type === `image` ? <ImageCard key={card.id} {...card} /> : <TextCard key={card.id} {...card} />,
        )}
      </div>
      <div className={styles.sentinel} ref={sentinelRef} />
    </div>
  </Page>
);
