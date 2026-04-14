import { Button } from "@snappy/ui";

import type { useStaticFormState } from "./StaticForm.state";

import { t } from "../../locales";
import styles from "./StaticForm.module.scss";
import { StaticFormField } from "./StaticFormField";

export type StaticFormViewProps = ReturnType<typeof useStaticFormState>;

export const StaticFormView = ({ cancel, disabled, fields, submit }: StaticFormViewProps) => (
  <div className={styles.root}>
    {fields.map(field => (
      <StaticFormField key={field.id} label={field.label}>
        <field.Component {...field.props} />
      </StaticFormField>
    ))}
    <div className={styles.actions}>
      <Button disabled={disabled} onClick={submit} text={t(`chat.continue`)} type="primary" />
      <Button disabled={disabled} onClick={cancel} text={t(`chat.cancel`)} />
    </div>
  </div>
);
