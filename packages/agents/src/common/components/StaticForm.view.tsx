/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";
import { Button, Card, Switch, Tabs, TextInput } from "@snappy/ui";

import type { StaticFormViewProps } from "./StaticForm.state";

import { t } from "../../locales";
import styles from "./StaticForm.module.scss";
import { StaticFormField } from "./StaticFormField";

export const StaticFormView = ({ answers, disabled, pickFile, plan, setField, submit }: StaticFormViewProps) => (
  <Card>
    <div className={styles.root}>
      <h3 className={styles.title}>{plan.title}</h3>
      {plan.fields.map(field => {
        const value = answers[field.id];
        const onChange = (v: boolean | File | number | string | string[] | undefined) => setField(field.id, v);

        const child = (() => {
          if (field.kind === `file`) {
            const { accept, hint, id, pickLabel } = field;
            const name = value instanceof File ? value.name : ``;
            const acceptList = accept === undefined ? [`audio/*`] : [accept];

            return (
              <div className={styles.filePick}>
                <Button disabled={disabled} onClick={async () => pickFile(id, acceptList)} text={pickLabel} />
                {_.isString(hint) && hint !== `` ? <span className={styles.fileHint}>{hint}</span> : undefined}
                {name === `` ? undefined : <span className={styles.fileName}>{name}</span>}
              </div>
            );
          }

          if (field.kind === `toggle`) {
            const checked = _.isBoolean(value) && value;

            return <Switch checked={checked} disabled={disabled} label={field.label} onChange={onChange} />;
          }

          if (field.kind === `tabs_single` || field.kind === `tabs_multi`) {
            const { kind, options } = field;
            const multi = kind === `tabs_multi`;
            const selectedMulti = _.isArray(value) ? value : [];
            const selectedSingle = _.isString(value) ? value : options[0]?.value;

            const tabOptions = options.map(option => ({
              label: option.label,
              title: option.label,
              value: option.value,
            }));

            return multi ? (
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
            );
          }

          return (
            <TextInput
              disabled={disabled}
              maxLines={8}
              onChange={onChange}
              placeholder={field.placeholder ?? ``}
              value={_.isString(value) ? value : ``}
            />
          );
        })();

        return (
          <StaticFormField key={field.id} label={field.label}>
            {child}
          </StaticFormField>
        );
      })}
      <Button disabled={disabled} onClick={submit} text={t(`chat.continue`)} type="primary" />
    </div>
  </Card>
);
