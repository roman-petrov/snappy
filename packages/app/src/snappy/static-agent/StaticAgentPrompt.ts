import type {
  StaticFormAnswers,
  StaticFormAnswersOf,
  StaticFormFieldByKind,
  StaticFormFieldKind,
  StaticFormPlan,
} from "@snappy/snappy";

import { _ } from "@snappy/core";

export type StaticAgentPromptInput<TPlan extends StaticFormPlan = StaticFormPlan> = {
  answers: StaticFormAnswersOf<TPlan>;
  mainPrompt?: string;
  plan: TPlan;
};

type NonTextFieldKind = Exclude<StaticFormFieldKind, `audio_input` | `image_input` | `text_input`>;

export const StaticAgentPrompt = <TPlan extends StaticFormPlan>({
  answers,
  mainPrompt,
  plan,
}: StaticAgentPromptInput<TPlan>) => {
  const values: StaticFormAnswers = answers;
  const head = (mainPrompt ?? ``).trim();
  const labelLine = (label: string, value: string) => `${label}: ${value}`;

  const promptValue = (prompt: string | undefined, fallback: string) => {
    const value = prompt?.trim();

    return value === undefined || value === `` ? fallback : value;
  };

  const nonTextLine = (field: StaticFormFieldByKind<NonTextFieldKind>, raw: unknown) => {
    switch (field.kind) {
      case `binary_choice`: {
        return _.isBoolean(raw)
          ? labelLine(field.label.text, promptValue(raw ? field.promptOn : field.promptOff, raw ? `yes` : `no`))
          : undefined;
      }
      case `multiple_choice`: {
        const selected = new Set(_.isArray(raw) ? raw.filter(_.isString) : []);

        const labels = (field.options ?? [])
          .filter(option => selected.has(option.value))
          .map(option => promptValue(option.prompt, option.label.text));

        return labels.length === 0 ? undefined : labelLine(field.label.text, labels.join(`, `));
      }
      case `single_choice`: {
        const value = _.isString(raw) ? raw.trim() : ``;
        if (value === ``) {
          return undefined;
        }
        const selectedOption = (field.options ?? []).find(option => option.value === value);

        const label =
          selectedOption === undefined ? value : promptValue(selectedOption.prompt, selectedOption.label.text);

        return labelLine(field.label.text, label);
      }
      default: {
        return undefined;
      }
    }
  };

  const textLine = (field: StaticFormFieldByKind<`text_input`>, raw: unknown) => {
    const value = raw === undefined || raw === null ? `` : _.isString(raw) ? raw.trim() : ``;

    return value === `` ? undefined : labelLine(field.label.text, JSON.stringify(value));
  };

  const valueFields = plan.fields.filter(
    (field): field is StaticFormFieldByKind<NonTextFieldKind> =>
      field.kind !== `text_input` && field.kind !== `image_input` && field.kind !== `audio_input`,
  );

  const lines = [
    ...valueFields.map(field => nonTextLine(field, values[field.id])),
    ...plan.fields
      .filter((field): field is StaticFormFieldByKind<`text_input`> => field.kind === `text_input`)
      .map(field => textLine(field, values[field.id])),
  ]
    .filter((line): line is string => line !== undefined)
    .map(line => `- ${line}`);

  if (head === ``) {
    return lines.join(`\n`);
  }
  if (lines.length === 0) {
    return head;
  }

  return [head, ``, ...lines].join(`\n`);
};
