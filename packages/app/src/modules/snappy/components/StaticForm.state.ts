/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";
import {
  type StaticFormAnswers,
  StaticFormAnswersOf,
  type StaticFormAnswerValueByKind,
  type StaticFormField,
  type StaticFormFieldByKind,
  type StaticFormPlan,
} from "@snappy/snappy";
import { AudioSelect, ImageSelect, Switch, Tabs, TextInput } from "@snappy/ui";
import { type ElementType, useRef, useState } from "react";

import type { StaticFormProps } from "./StaticForm";

import { StaticFormValues } from "../core/StaticFormValues";

const display = {
  audio: (file: File) => ({ file, type: `audio` }) as const,
  binary: (value: boolean) => ({ type: `binary`, value }) as const,
  image: (file: File) => ({ file, type: `image` }) as const,
  text: (text: string) => ({ text, type: `text` }) as const,
} as const;

type FieldByKind<TKind extends FieldKind> = StaticFormFieldByKind<TKind>;

type FieldInput<TKind extends FieldKind> = {
  field: FieldByKind<TKind>;
  setField: (id: string, value: ValueByKind<TKind>) => void;
  value: ValueByKind<TKind>;
};

type FieldKind = StaticFormField[`kind`];

type ValueByKind<TKind extends FieldKind> = StaticFormAnswerValueByKind<TKind>;

const stringDefault = (value: StaticFormField[`default`], fallback: string) => (_.isString(value) ? value : fallback);
const stringListDefault = (value: StaticFormField[`default`]) => (_.isArray(value) ? value.filter(_.isString) : []);

const optionLabel = (option: { label: { emoji: string; text: string } }) =>
  `${option.label.emoji} ${option.label.text}`;

const tabOptions = (field: FieldByKind<`multiple_choice`> | FieldByKind<`single_choice`>) =>
  (field.options ?? []).map(option => {
    const label = optionLabel(option);

    return { label, title: label, value: option.value };
  });

const fileSelect = ({ field, setField, value }: FieldInput<`audio_input` | `image_input`>) => ({
  hint: field.hint,
  onChange: (files: File[]) => setField(field.id, files[0]),
  pickLabel: field.pickLabel ?? ``,
  value,
});

const displayOf = (field: StaticFormField, raw: StaticFormAnswers[string]) => {
  switch (field.kind) {
    case `audio_input`: {
      return raw instanceof File ? display.audio(raw) : display.text(``);
    }
    case `binary_choice`: {
      return _.isBoolean(raw) ? display.binary(raw) : display.text(``);
    }
    case `image_input`: {
      return raw instanceof File ? display.image(raw) : display.text(``);
    }
    case `multiple_choice`: {
      const labels = StaticFormValues.selectedOptions({ field, raw }).map(optionLabel);

      return display.text(labels.join(`, `));
    }
    case `single_choice`: {
      const value = StaticFormValues.singleValue(raw);

      if (value === ``) {
        return display.text(``);
      }

      const option = StaticFormValues.findOption({ field, value });

      return display.text(option === undefined ? value : optionLabel(option));
    }
    case `text_input`: {
      const value = raw === undefined || !_.isString(raw) ? `` : raw.trim();

      return display.text(value);
    }
    default: {
      return display.text(``);
    }
  }
};

type KindConfig<TKind extends FieldKind> = {
  component: ElementType;
  default: (field: FieldByKind<TKind>) => ValueByKind<TKind>;
  props: (input: FieldInput<TKind>) => Record<string, unknown>;
};

const fieldByKind: { [TKind in FieldKind]: KindConfig<TKind> } = {
  audio_input: { component: AudioSelect, default: () => undefined, props: fileSelect },
  binary_choice: {
    component: Switch,
    default: (field: FieldByKind<`binary_choice`>) => (_.isBoolean(field.default) ? field.default : false),
    props: ({ field, setField, value }: FieldInput<`binary_choice`>) => ({
      checked: value,
      label: optionLabel(field),
      onChange: (checked: boolean) => setField(field.id, checked),
    }),
  },
  image_input: { component: ImageSelect, default: () => undefined, props: fileSelect },
  multiple_choice: {
    component: Tabs,
    default: (field: FieldByKind<`multiple_choice`>) => stringListDefault(field.default),
    props: ({ field, setField, value }: FieldInput<`multiple_choice`>) => ({
      isActive: (item: string) => value.includes(item),
      onChange: (clicked: string) =>
        setField(field.id, value.includes(clicked) ? value.filter(item => item !== clicked) : [...value, clicked]),
      options: tabOptions(field),
      value: field.options?.[0]?.value ?? ``,
    }),
  },
  single_choice: {
    component: Tabs,
    default: (field: FieldByKind<`single_choice`>) => stringDefault(field.default, field.options?.[0]?.value ?? ``),
    props: ({ field, setField, value }: FieldInput<`single_choice`>) => ({
      onChange: (selected: string) => setField(field.id, selected),
      options: tabOptions(field),
      value,
    }),
  },
  text_input: {
    component: TextInput,
    default: (field: FieldByKind<`text_input`>) => stringDefault(field.default, ``),
    props: ({ field, setField, value }: FieldInput<`text_input`>) => ({
      maxLines: 8,
      onChange: (text: string) => setField(field.id, text),
      placeholder: field.placeholder ?? ``,
      value: value ?? ``,
    }),
  },
};

const isSubmitted = <TPlan extends StaticFormPlan>(
  props: StaticFormProps<TPlan>,
): props is { answers: StaticFormAnswers; plan: TPlan } => `answers` in props;

export const useStaticFormState = <TPlan extends StaticFormPlan>(props: StaticFormProps<TPlan>) => {
  const { plan } = props;
  const submitted = isSubmitted(props);

  const [answers, setAnswers] = useState<StaticFormAnswers>(() => {
    if (isSubmitted(props)) {
      return props.answers;
    }

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

  const submit = () => {
    if (!isSubmitted(props)) {
      props.onSubmit(StaticFormAnswersOf<TPlan>(answersRef.current));
    }
  };

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

  const rows = submitted
    ? plan.fields.map(field => ({
        display: displayOf(field, props.answers[field.id]),
        id: field.id,
        label: optionLabel(field),
      }))
    : [];

  return { fields: submitted ? [] : plan.fields.map(fieldView), rows, submit, submitted, title: plan.title };
};
