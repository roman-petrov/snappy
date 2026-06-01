import { Button, Card } from "@snappy/ui";

import type { useStaticFormState } from "./StaticForm.state";

import { t } from "../../locales";
import styles from "./StaticForm.module.scss";
import { StaticFormField } from "./StaticFormField";

export type StaticFormViewProps = ReturnType<typeof useStaticFormState>;

export const StaticFormView = ({ fields, submit }: StaticFormViewProps) => (
  <Card cn={styles.card}>
    <div className={styles.root}>
      {fields.map(field => (
        <StaticFormField key={field.id} cn={styles.field} label={field.label}>
          <field.Component {...field.props} />
        </StaticFormField>
      ))}
      <div className={styles.actions}>
        <Button onClick={submit} text={t(`chat.continue`)} type="primary" />
      </div>
    </div>
  </Card>
);
