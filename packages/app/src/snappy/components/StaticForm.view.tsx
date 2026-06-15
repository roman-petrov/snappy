import { AudioFile, Button, Card, ImageFile, Spoiler, Table, Text } from "@snappy/ui";

import type { useStaticFormState } from "./StaticForm.state";

import { t } from "../../locales";
import styles from "./StaticForm.module.scss";
import { StaticFormField } from "./StaticFormField";

export type StaticFormViewProps = ReturnType<typeof useStaticFormState>;

export const StaticFormView = ({ fields, rows, submit, submitted, title }: StaticFormViewProps) => {
  const card = (
    <Card cn={styles.card}>
      <div className={styles.root}>
        {title === undefined ? undefined : <Text as="h2" cn={styles.title} text={title} typography="h2" />}
        {submitted ? (
          <div className={styles.answers}>
            <Table
              columns={[
                { content: t(`chat.form.label`), key: `label` },
                { content: t(`chat.form.value`), key: `value` },
              ]}
              rows={rows.map(({ display, id, label }) => ({
                id,
                label,
                value:
                  display.type === `audio` ? (
                    <AudioFile file={display.file} />
                  ) : display.type === `image` ? (
                    <ImageFile file={display.file} />
                  ) : display.type === `binary` ? (
                    <Text text={display.value ? t(`chat.form.yes`) : t(`chat.form.no`)} />
                  ) : (
                    <Text text={display.text === `` ? `—` : display.text} />
                  ),
              }))}
            />
          </div>
        ) : (
          fields.map(field => (
            <StaticFormField cn={styles.field} key={field.id} label={field.label}>
              <field.Component {...field.props} />
            </StaticFormField>
          ))
        )}
        {submitted ? undefined : (
          <div className={styles.actions}>
            <Button onClick={submit} text={t(`chat.continue`)} type="primary" />
          </div>
        )}
      </div>
    </Card>
  );

  return submitted ? (
    <Spoiler summary={title === undefined || title === `` ? t(`chat.form.summary`) : title}>{card}</Spoiler>
  ) : (
    card
  );
};
