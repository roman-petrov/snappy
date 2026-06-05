import { Button, Card, Text } from "@snappy/ui";

import type { useStaticFormState } from "./StaticForm.state";

import { t } from "../../locales";
import styles from "./StaticForm.module.scss";
import { StaticFormField } from "./StaticFormField";

export type StaticFormViewProps = ReturnType<typeof useStaticFormState>;

export const StaticFormView = ({ fields, submit, title }: StaticFormViewProps) => (
  <Card cn={styles.card}>
    <div className={styles.root}>
      {title === undefined ? undefined : <Text as="h2" cn={styles.title} text={title} typography="h2" />}
      {fields.map(field => (
        <StaticFormField cn={styles.field} key={field.id} label={field.label}>
          <field.Component {...field.props} />
        </StaticFormField>
      ))}
      <div className={styles.actions}>
        <Button onClick={submit} text={t(`chat.continue`)} type="primary" />
      </div>
    </div>
  </Card>
);
