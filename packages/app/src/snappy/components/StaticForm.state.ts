/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type {
  StaticFormAnswers,
  StaticFormAnswersOf,
  StaticFormAnswerValue,
  StaticFormField,
  StaticFormFieldByKind,
  StaticFormPlan,
} from "@snappy/snappy-sdk";

import { _ } from "@snappy/core";
import { FileSelect, Switch, Tabs, TextInput } from "@snappy/ui";
import { type ComponentProps, type ElementType, useRef, useState } from "react";

import type { StaticFormProps } from "./StaticForm";

type FieldByKind<TKind extends FieldKind> = StaticFormFieldByKind<TKind>;

type FieldConfig<TKind extends FieldKind> = {
  component: ElementType;
  default: (field: FieldByKind<TKind>) => ValueByKind<TKind>;
  props: (input: FieldConfigInput<TKind>) => Record<string, unknown>;
};

type FieldConfigInput<TKind extends FieldKind> = {
  field: FieldByKind<TKind>;
  setField: (id: string, value: ValueByKind<TKind>) => void;
  value: ValueByKind<TKind>;
};

type FieldKind = StaticFormField[`kind`];

type ValueByKind<TKind extends FieldKind> = StaticFormAnswerValue<FieldByKind<TKind>>;

const stringDefault = (value: StaticFormField[`default`], fallback: string) => (_.isString(value) ? value : fallback);
const stringListDefault = (value: StaticFormField[`default`]) => (_.isArray(value) ? value.filter(_.isString) : []);

const tabOptions = (field: FieldByKind<`multiple_choice`> | FieldByKind<`single_choice`>) =>
  (field.options ?? []).map(option => {
    const label = `${option.label.emoji} ${option.label.text}`;

    return { label, title: label, value: option.value };
  });

const fieldConfig = <TKind extends FieldKind, TComponent extends ElementType>(config: {
  component: TComponent;
  default: (field: FieldByKind<TKind>) => ValueByKind<TKind>;
  props: (input: FieldConfigInput<TKind>) => ComponentProps<TComponent>;
}): FieldConfig<TKind> => config;

const fieldByKind: { [TKind in FieldKind]: FieldConfig<TKind> } = {
  binary_choice: fieldConfig({
    component: Switch,
    default: field => (_.isBoolean(field.default) ? field.default : false),
    props: ({ field, setField, value }) => ({
      checked: value,
      label: `${field.label.emoji} ${field.label.text}`,
      onChange: checked => setField(field.id, checked),
    }),
  }),
  file_input: fieldConfig({
    component: FileSelect,
    default: () => undefined,
    props: ({ field, setField, value }) => ({
      accept: field.accept === undefined ? [`audio/*`] : [field.accept],
      fileName: value?.name ?? ``,
      hint: field.hint,
      onChange: files => setField(field.id, files[0]),
      pickLabel: field.pickLabel ?? ``,
    }),
  }),
  multiple_choice: fieldConfig({
    component: Tabs,
    default: field => stringListDefault(field.default),
    props: ({ field, setField, value }) => ({
      isActive: item => value.includes(item),
      onChange: clicked =>
        setField(field.id, value.includes(clicked) ? value.filter(item => item !== clicked) : [...value, clicked]),
      options: tabOptions(field),
      value: field.options?.[0]?.value ?? ``,
    }),
  }),
  single_choice: fieldConfig({
    component: Tabs,
    default: field => stringDefault(field.default, field.options?.[0]?.value ?? ``),
    props: ({ field, setField, value }) => ({
      onChange: selected => setField(field.id, selected),
      options: tabOptions(field),
      value,
    }),
  }),
  text_input: fieldConfig({
    component: TextInput,
    default: field => stringDefault(field.default, ``),
    props: ({ field, setField, value }) => ({
      maxLines: 8,
      onChange: text => setField(field.id, text),
      placeholder: field.placeholder ?? ``,
      value,
    }),
  }),
};

export const useStaticFormState = <TPlan extends StaticFormPlan>({ onSubmit, plan }: StaticFormProps<TPlan>) => {
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

  const submit = () => onSubmit(answersRef.current as StaticFormAnswersOf<TPlan>);

  const fieldView = <TKind extends FieldKind>(field: FieldByKind<TKind>) => {
    const config = fieldByKind[field.kind];
    const stored = answers[field.id];
    const value = stored === undefined ? config.default(field) : (stored as ValueByKind<TKind>);

    return {
      Component: config.component,
      id: field.id,
      label: field.label,
      props: config.props({ field, setField, value }),
    };
  };

  const fields = plan.fields.map(fieldView);

  return { fields, submit };
};
