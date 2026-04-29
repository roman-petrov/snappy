import { Button, TextCard } from "@snappy/ui";

import type { useStaticAudioAgentComponentState } from "./StaticAudioAgentComponent.state";

import { StaticForm } from "../../components";
import styles from "./StaticAudioAgentComponent.module.scss";

type StaticAudioAgentComponentViewProps = ReturnType<typeof useStaticAudioAgentComponentState>;

type Tool = StaticAudioAgentComponentViewProps[`lines`][number][`tool`];

const toolName = (locale: StaticAudioAgentComponentViewProps[`locale`], value: Tool) => {
  if (value === `speechRecognition`) {
    return locale === `ru` ? `Речь` : `Speech`;
  }

  return locale === `ru` ? `Чат` : `Chat`;
};

const lineText = (locale: StaticAudioAgentComponentViewProps[`locale`], value: string) => {
  if (value === `chat.feed.chat.pending`) {
    return locale === `ru` ? `Ожидаю ответ` : `Waiting for response`;
  }
  if (value === `chat.feed.chat.done`) {
    return locale === `ru` ? `Ответ получен` : `Response generated`;
  }
  if (value === `chat.feed.speechRecognition.pending`) {
    return locale === `ru` ? `Распознаю речь` : `Recognizing speech`;
  }
  if (value === `chat.feed.speechRecognition.done`) {
    return locale === `ru` ? `Речь распознана` : `Speech recognized`;
  }

  return value;
};

export const StaticAudioAgentComponentView = ({
  artifacts,
  finishVisible,
  formProps,
  lines,
  locale,
  onFinish,
}: StaticAudioAgentComponentViewProps) => (
  <article className={styles.root}>
    <header className={styles.header}>
      <h3 className={styles.title}>{locale === `ru` ? `Агент` : `Agent`}</h3>
      <p className={styles.subtitle}>
        {locale === `ru`
          ? `Агент обрабатывает запрос и готовит результат.`
          : `Agent processes request and prepares output.`}
      </p>
    </header>
    {lines.length === 0 ? undefined : (
      <section className={styles.activity}>
        {lines.map(item => (
          <p className={styles.line} key={item.id}>
            {item.status === `running` ? (
              <span className={styles.spinner} />
            ) : (
              <span className={styles.icon}>{item.status === `error` ? `x` : `v`}</span>
            )}
            <span>{`${toolName(locale, item.tool)} - ${lineText(locale, item.text)}`}</span>
            {item.cost === undefined ? undefined : <span className={styles.cost}>{item.cost.toFixed(4)}</span>}
          </p>
        ))}
      </section>
    )}
    {formProps === undefined ? undefined : <StaticForm {...formProps} />}
    {artifacts.map(item => (
      <TextCard copyLabel={locale === `ru` ? `Копировать` : `Copy`} html={item.html} key={item.id} />
    ))}
    {finishVisible ? (
      <Button onClick={onFinish} text={locale === `ru` ? `Завершить` : `Finish`} type="primary" />
    ) : undefined}
  </article>
);
