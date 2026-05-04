import { Button, ImageCard, TextCard } from "@snappy/ui";

import type { StaticFormPlan } from "../../../core";
import type { AgentLocale } from "../../../Types";
import type { AgentFeedItem } from "./Types";

import { StaticForm } from "../StaticForm";
import styles from "./AgentFeed.module.scss";
import { AgentFeedStreamRow } from "./AgentFeedStreamRow";
import { AgentFeedTextStreamCard } from "./AgentFeedTextStreamCard";
import { StatusText } from "./StatusText";

const imageProgressSrc =
  `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7` as const;

export type AgentFeedProps = {
  entries: AgentFeedItem[];
  finishVisible: boolean;
  locale: AgentLocale;
  onFinish: () => void;
  onFormCancel: () => void;
  onFormSubmit: (value: Record<string, unknown>) => void;
  pendingForm: undefined | { plan: StaticFormPlan };
};

export const AgentFeed = ({
  entries,
  finishVisible,
  locale,
  onFinish,
  onFormCancel,
  onFormSubmit,
  pendingForm,
}: AgentFeedProps) => (
  <article className={styles.root}>
    {entries.length === 0 ? undefined : (
      <section className={styles.activity}>
        {entries.map(({ entry, key }) =>
          entry.type === `artifact` ? (
            entry.artifact.type === `image` ? (
              <ImageCard key={key} src={entry.artifact.src} />
            ) : (
              <TextCard html={entry.artifact.html} key={key} />
            )
          ) : entry.type === `image-card-progress` ? (
            <ImageCard busy key={key} src={imageProgressSrc} />
          ) : entry.type === `text-card-stream` ? (
            <AgentFeedTextStreamCard chunks={entry.chunks} key={key} />
          ) : entry.type === `status` ? (
            <StatusText finished={entry.finished} key={key} text={entry.text} typography="caption" />
          ) : (
            <AgentFeedStreamRow chunks={entry.chunks} key={key} typography="caption" />
          ),
        )}
      </section>
    )}
    {pendingForm === undefined ? undefined : (
      <StaticForm onCancel={onFormCancel} onSubmit={onFormSubmit} plan={pendingForm.plan} />
    )}
    {finishVisible ? (
      <Button onClick={onFinish} text={locale === `ru` ? `Завершить` : `Finish`} type="primary" />
    ) : undefined}
  </article>
);
