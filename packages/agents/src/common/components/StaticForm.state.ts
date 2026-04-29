/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { FileSelect, Switch, Tabs, TextInput } from "@snappy/ui";
import { type ComponentProps, type ElementType, useRef, useState } from "react";

import type { StaticFormAnswers, StaticFormField } from "../../core";
import type { StaticFormProps } from "./StaticForm";

type FieldByKind<TKind extends FieldKind> = Extract<StaticFormField, { kind: TKind }>;

type FieldConfig<TKind extends FieldKind> = {
  component: ElementType;
  default: (field: FieldByKind<TKind>) => ValueByKind<TKind>;
  props: (input: FieldConfigInput<TKind>) => Record<string, unknown>;
};

type FieldConfigInput<TKind extends FieldKind> = {
  disabled: boolean;
  field: FieldByKind<TKind>;
  setField: (id: string, value: ValueByKind<TKind>) => void;
  value: ValueByKind<TKind>;
};

type FieldKind = StaticFormField[`kind`];

type ValueByKind<TKind extends FieldKind> = TKind extends `file`
  ? File | undefined
  : TKind extends `tabs_multi`
    ? string[]
    : TKind extends `tabs_single`
      ? string
      : TKind extends `text`
        ? string
        : TKind extends `toggle`
          ? boolean
          : never;

const tabOptions = (field: FieldByKind<`tabs_multi`> | FieldByKind<`tabs_single`>) =>
  field.options.map(option => ({ label: option.label, title: option.label, value: option.value }));

const fieldConfig = <TKind extends FieldKind, TComponent extends ElementType>(config: {
  component: TComponent;
  default: (field: FieldByKind<TKind>) => ValueByKind<TKind>;
  props: (input: FieldConfigInput<TKind>) => ComponentProps<TComponent>;
}): FieldConfig<TKind> => config;

const fieldByKind: { [TKind in FieldKind]: FieldConfig<TKind> } = {
  file: fieldConfig({
    component: FileSelect,
    default: () => undefined,
    props: ({ disabled, field, setField, value }) => ({
      accept: field.accept === undefined ? [`audio/*`] : [field.accept],
      disabled,
      fileName: value?.name ?? ``,
      hint: field.hint,
      onChange: files => setField(field.id, files[0]),
      pickLabel: field.pickLabel,
    }),
  }),
  tabs_multi: fieldConfig({
    component: Tabs,
    default: field => field.default ?? [],
    props: ({ disabled, field, setField, value }) => ({
      disabled,
      isActive: item => value.includes(item),
      onChange: clicked =>
        setField(field.id, value.includes(clicked) ? value.filter(item => item !== clicked) : [...value, clicked]),
      options: tabOptions(field),
      tabs: false,
      value: field.options[0]?.value ?? ``,
    }),
  }),
  tabs_single: fieldConfig({
    component: Tabs,
    default: field => field.default ?? field.options[0]?.value ?? ``,
    props: ({ disabled, field, setField, value }) => ({
      disabled,
      onChange: selected => setField(field.id, selected),
      options: tabOptions(field),
      value,
    }),
  }),
  text: fieldConfig({
    component: TextInput,
    default: field => field.default ?? ``,
    props: ({ disabled, field, setField, value }) => ({
      disabled,
      maxLines: 8,
      onChange: text => setField(field.id, text),
      placeholder: field.placeholder ?? ``,
      value,
    }),
  }),
  toggle: fieldConfig({
    component: Switch,
    default: field => field.default ?? false,
    props: ({ disabled, field, setField, value }) => ({
      checked: value,
      disabled,
      label: field.label,
      onChange: checked => setField(field.id, checked),
    }),
  }),
};

export const useStaticFormState = ({ disabled = false, onCancel, onSubmit, plan }: StaticFormProps) => {
  const [answers, setAnswers] = useState<StaticFormAnswers>(() => {
    const initial: StaticFormAnswers = {};

    const setInitial = <TKind extends FieldKind>(field: FieldByKind<TKind>) => {
      initial[field.id] = fieldByKind[field.kind].default(field);
    };
    for (const field of plan.fields) {
      setInitial(field);
    }

    return initial;
  });

  const answersRef = useRef(answers);

  const setField = (id: string, value: StaticFormAnswers[string]) =>
    setAnswers(previous => {
      const next = { ...previous, [id]: value };
      answersRef.current = next;

      return next;
    });

  const submit = () => onSubmit(answersRef.current);
  const cancel = onCancel;

  const fieldView = <TKind extends FieldKind>(field: FieldByKind<TKind>) => {
    const config = fieldByKind[field.kind];
    const stored = answers[field.id];
    const value = stored === undefined ? config.default(field) : (stored as ValueByKind<TKind>);

    return {
      Component: config.component,
      id: field.id,
      label: field.label,
      props: config.props({ disabled, field, setField, value }),
    };
  };

  const fields = plan.fields.map(fieldView);

  return { cancel, disabled, fields, submit };
};
