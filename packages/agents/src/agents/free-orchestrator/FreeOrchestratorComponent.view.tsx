import { Button, ImageCard, StreamingText, TextCard } from "@snappy/ui";

import type { useFreeOrchestratorComponentState } from "./FreeOrchestratorComponent.state";

import { StaticForm } from "../../common/components";
import styles from "./FreeOrchestratorComponent.module.scss";
import { MessageSurface } from "./MessageSurface";
import { Start } from "./Start";
import { StatusText } from "./StatusText";

type FreeOrchestratorComponentViewProps = ReturnType<typeof useFreeOrchestratorComponentState>;

export const FreeOrchestratorComponentView = ({
  artifacts,
  entries,
  finishVisible,
  locale,
  onFinish,
  onFormCancel,
  onFormSubmit,
  pendingForm,
  starterProps,
}: FreeOrchestratorComponentViewProps) => (
  <article className={styles.root}>
    <header className={styles.header}>
      <h3 className={styles.title}>{locale === `ru` ? `Свободный оркестратор` : `Free orchestrator`}</h3>
      <p className={styles.subtitle}>
        {locale === `ru`
          ? `Оркестратор выполняет шаги и вызывает инструменты.`
          : `Orchestrator runs steps and calls tools.`}
      </p>
    </header>
    {entries.length === 0 ? undefined : (
      <section className={styles.activity}>
        {entries.map(({ entry, key }) =>
          entry.type === `status` ? (
            <MessageSurface key={key}>
              <StatusText finished={entry.finished} text={entry.text} typography="caption" />
            </MessageSurface>
          ) : (
            <MessageSurface key={key}>
              <StreamingText chunks={entry.chunks} typography="caption" />
            </MessageSurface>
          ),
        )}
      </section>
    )}
    {starterProps === undefined ? undefined : <Start {...starterProps} />}
    {pendingForm === undefined ? undefined : (
      <StaticForm onCancel={onFormCancel} onSubmit={onFormSubmit} plan={pendingForm.plan} />
    )}
    {artifacts.map(item =>
      item.type === `image` ? (
        <ImageCard copyLabel={locale === `ru` ? `Копировать` : `Copy`} key={item.id} src={item.src} />
      ) : (
        <TextCard copyLabel={locale === `ru` ? `Копировать` : `Copy`} html={item.html} key={item.id} />
      ),
    )}
    {finishVisible ? (
      <Button onClick={onFinish} text={locale === `ru` ? `Завершить` : `Finish`} type="primary" />
    ) : undefined}
  </article>
);
