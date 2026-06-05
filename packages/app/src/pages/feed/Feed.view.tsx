import { Button, Page } from "@snappy/ui";

import type { useFeedState } from "./Feed.state";

import { t } from "../../core";
import { Routes } from "../../Routes";
import { ImageCard, TextCard } from "../../snappy/components";
import styles from "./Feed.module.scss";

export type FeedViewProps = ReturnType<typeof useFeedState>;

export const FeedView = ({ cards }: FeedViewProps) => (
  <Page back title={t(`feed.title`)}>
    <div className={styles.actionRow}>
      <Button link={Routes.$.home} text={t(`feed.openCatalog`)} />
    </div>
    <div className={styles.cards}>
      {cards?.map(card =>
        card.type === `image` ? <ImageCard key={card.id} {...card} /> : <TextCard key={card.id} {...card} />,
      )}
    </div>
  </Page>
);
