import type { useStaticFormState } from "./StaticForm.state";

import { t } from "../locales";
import { AudioFile } from "./AudioFile";
import { Button } from "./Button";
import { Card } from "./Card";
import { ImageFile } from "./ImageFile";
import { Spoiler } from "./Spoiler";
import styles from "./StaticForm.module.scss";
import { StaticFormField } from "./StaticFormField";
import { Table } from "./Table";
import { Text } from "./Text";

export type StaticFormViewProps = ReturnType<typeof useStaticFormState>;

export const StaticFormView = ({
  fields,
  rows,
  submit,
  submitTag,
  submitted,
  submitText,
  title,
}: StaticFormViewProps) => {
  const card = (
    <Card cn={styles.card}>
      <div className={styles.root}>
        {title === undefined ? undefined : <Text as="h2" cn={styles.title} text={title} typography="h2" />}
        {submitted ? (
          <div className={styles.answers}>
            <Table
              columns={[
                { content: t(`form.label`), key: `label` },
                { content: t(`form.value`), key: `value` },
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
                    <Text text={display.value ? t(`form.yes`) : t(`form.no`)} />
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
            <Button onClick={submit} tag={submitTag} text={submitText} type="primary" />
          </div>
        )}
      </div>
    </Card>
  );

  return submitted ? (
    <Spoiler summary={title === undefined || title === `` ? t(`form.summary`) : title}>{card}</Spoiler>
  ) : (
    card
  );
};
