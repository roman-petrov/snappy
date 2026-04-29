import { Button, ImageCard } from "@snappy/ui";

import type { useStaticVisualAgentComponentState } from "./StaticVisualAgentComponent.state";

import { StaticForm } from "../../components";
import styles from "./StaticVisualAgentComponent.module.scss";

type StaticVisualAgentComponentViewProps = ReturnType<typeof useStaticVisualAgentComponentState>;

type Tool = StaticVisualAgentComponentViewProps[`lines`][number][`tool`];

const toolName = (locale: StaticVisualAgentComponentViewProps[`locale`], value: Tool) => {
  if (value === `image`) {
    return locale === `ru` ? `Изображение` : `Image`;
  }

  return locale === `ru` ? `Чат` : `Chat`;
};

const lineText = (locale: StaticVisualAgentComponentViewProps[`locale`], value: string) => {
  if (value === `chat.feed.chat.pending`) {
    return locale === `ru` ? `Ожидаю ответ` : `Waiting for response`;
  }
  if (value === `chat.feed.chat.done`) {
    return locale === `ru` ? `Ответ получен` : `Response generated`;
  }
  if (value === `chat.feed.image.pending`) {
    return locale === `ru` ? `Генерирую изображение` : `Generating image`;
  }
  if (value === `chat.feed.image.done`) {
    return locale === `ru` ? `Изображение готово` : `Image generated`;
  }

  return value;
};

export const StaticVisualAgentComponentView = ({
  artifacts,
  finishVisible,
  formProps,
  lines,
  locale,
  onFinish,
}: StaticVisualAgentComponentViewProps) => (
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
      <ImageCard copyLabel={locale === `ru` ? `Копировать` : `Copy`} key={item.id} src={item.src} />
    ))}
    {finishVisible ? (
      <Button onClick={onFinish} text={locale === `ru` ? `Завершить` : `Finish`} type="primary" />
    ) : undefined}
  </article>
);
