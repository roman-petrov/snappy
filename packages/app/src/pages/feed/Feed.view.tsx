import { Button } from "@snappy/ui";

import type { useFeedState } from "./Feed.state";

import { Page } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import { ImageCard, TextCard } from "../../snappy/components";
import styles from "./Feed.module.scss";

export type FeedViewProps = ReturnType<typeof useFeedState>;

export const FeedView = ({ cards }: FeedViewProps) => (
  <Page title={t(`feed.title`)}>
    <div className={styles.actionRow}>
      <Button link={Routes.home} text={t(`feed.openCatalog`)} />
    </div>
    <div className={styles.cards}>
      {cards?.map(({ type, ...props }) =>
        type === `image` ? <ImageCard key={props.id} {...props} /> : <TextCard key={props.id} {...props} />,
      )}
    </div>
  </Page>
);
