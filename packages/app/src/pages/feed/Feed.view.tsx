import { Button, ImageCard, TextCard, useGo } from "@snappy/ui";

import type { useFeedState } from "./Feed.state";

import { Page } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import styles from "../dashboard/Dashboard.module.scss";

export type FeedViewProps = ReturnType<typeof useFeedState>;

export const FeedView = ({ artifacts, regenerateArtifact, regeneratingMessageIds }: FeedViewProps) => {
  const go = useGo();

  return (
    <Page>
      <div className={styles.root}>
        <div className={styles.actionRow}>
          <Button onClick={async () => go(Routes.home)} text={t(`chat.agentRoute`)} />
        </div>
        <div className={styles.chatLayer}>
          {artifacts.map(item =>
            item.type === `image` ? (
              <ImageCard
                busy={regeneratingMessageIds.has(item.id)}
                copyLabel={t(`dashboard.copy`)}
                key={item.id}
                onRegenerate={async () => regenerateArtifact({ kind: `image`, messageId: item.id })}
                regenerateLabel={t(`chat.feed.regenerate`)}
                src={item.src}
              />
            ) : (
              <TextCard
                busy={regeneratingMessageIds.has(item.id)}
                copyLabel={t(`dashboard.copy`)}
                html={item.html}
                key={item.id}
                onRegenerate={async () => regenerateArtifact({ kind: `text`, messageId: item.id })}
                regenerateLabel={t(`chat.feed.regenerate`)}
              />
            ),
          )}
        </div>
      </div>
    </Page>
  );
};
