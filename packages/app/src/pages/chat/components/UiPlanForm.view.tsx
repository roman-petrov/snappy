/* eslint-disable functional/no-expression-statements */

import type { UiField } from "@snappy/domain";

import { Button, Card, Switch, Tabs, TextInput } from "@snappy/ui";

import type { UiPlanFormViewProps } from "./UiPlanForm.state";

import { t } from "../../../core";
import styles from "./UiPlanForm.module.scss";

const FieldView = ({
  disabled,
  field,
  onChange,
  value,
}: {
  disabled: boolean;
  field: UiField;
  onChange: (v: boolean | number | string | string[] | undefined) => void;
  value: boolean | number | string | string[] | undefined;
}) => {
  if (field.kind === `toggle`) {
    const checked = value === true;

    return (
      <div className={styles.fieldRow}>
        <span className={styles.label}>{field.label}</span>
        <div className={styles.control}>
          <Switch checked={checked} disabled={disabled} label={field.label} onChange={onChange} />
        </div>
      </div>
    );
  }

  if (field.kind === `tabs_single` || field.kind === `tabs_multi`) {
    const { kind, label, options } = field;
    const multi = kind === `tabs_multi`;
    const selectedMulti = Array.isArray(value) ? value : [];
    const selectedSingle = typeof value === `string` ? value : options[0]?.value;
    const tabOptions = options.map(option => ({ label: option.label, title: option.label, value: option.value }));

    return (
      <div className={`${styles.fieldRow} ${styles.fieldRowStart}`}>
        <span className={styles.label}>{label}</span>
        <div className={styles.control}>
          {multi ? (
            <Tabs
              disabled={disabled}
              isActive={v => selectedMulti.includes(v)}
              onChange={clicked => {
                const active = selectedMulti.includes(clicked);
                const next = active ? selectedMulti.filter(item => item !== clicked) : [...selectedMulti, clicked];
                onChange(next);
              }}
              options={tabOptions}
              tabs={false}
              value={options[0]?.value ?? ``}
            />
          ) : (
            <Tabs
              disabled={disabled}
              onChange={onChange as (v: string) => void}
              options={tabOptions}
              value={selectedSingle ?? ``}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.fieldRow} ${styles.fieldRowStart}`}>
      <span className={styles.label}>{field.label}</span>
      <div className={styles.control}>
        <TextInput
          disabled={disabled}
          maxLines={8}
          onChange={onChange as (v: string) => void}
          placeholder={field.placeholder ?? ``}
          value={typeof value === `string` ? value : ``}
        />
      </div>
    </div>
  );
};

export const UiPlanFormView = ({ answers, disabled, plan, setField, submit }: UiPlanFormViewProps) => (
  <Card>
    <div className={styles.root}>
      <h3 className={styles.title}>{plan.title}</h3>
      {plan.fields.map(field => (
        <FieldView
          disabled={disabled}
          field={field}
          key={field.id}
          onChange={value => setField(field.id, value)}
          value={answers[field.id]}
        />
      ))}
      <Button disabled={disabled} onClick={submit} text={t(`dashboard.agent.continue`)} type="primary" />
    </div>
  </Card>
);
