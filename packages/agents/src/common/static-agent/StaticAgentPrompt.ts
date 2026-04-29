import { _ } from "@snappy/core";

import type { StaticFormField, StaticFormPlan } from "../../core";

export type StaticAgentPromptInput = { answers: Record<string, unknown>; mainPrompt?: string; plan: StaticFormPlan };

export const StaticAgentPrompt = ({ answers, mainPrompt, plan }: StaticAgentPromptInput) => {
  const head = (mainPrompt ?? ``).trim();
  const labelLine = (label: string, value: string) => `${label}: ${value}`;

  const promptValue = (prompt: string | undefined, fallback: string) => {
    const value = prompt?.trim();

    return value === undefined || value === `` ? fallback : value;
  };

  const nonTextLine = (field: Exclude<StaticFormField, { kind: `file` } | { kind: `text` }>, raw: unknown) => {
    switch (field.kind) {
      case `tabs_multi`: {
        const selected = new Set(_.isArray(raw) ? raw.filter(_.isString) : []);

        const labels = field.options
          .filter(option => selected.has(option.value))
          .map(option => promptValue(option.prompt, option.label));

        return labels.length === 0 ? undefined : labelLine(field.label, labels.join(`, `));
      }
      case `tabs_single`: {
        const value = _.isString(raw) ? raw.trim() : ``;
        if (value === ``) {
          return undefined;
        }
        const selectedOption = field.options.find(option => option.value === value);
        const label = selectedOption === undefined ? value : promptValue(selectedOption.prompt, selectedOption.label);

        return labelLine(field.label, label);
      }
      case `toggle`: {
        if (!_.isBoolean(raw)) {
          return undefined;
        }

        return labelLine(field.label, promptValue(raw ? field.promptOn : field.promptOff, raw ? `yes` : `no`));
      }
      default: {
        const exhaustive: never = field;

        return exhaustive;
      }
    }
  };

  const textLine = (field: Extract<StaticFormField, { kind: `text` }>, raw: unknown) => {
    const value = raw === undefined || raw === null ? `` : _.isString(raw) ? raw.trim() : ``;

    return value === `` ? undefined : labelLine(field.label, JSON.stringify(value));
  };

  const valueFields = plan.fields.filter(
    (field): field is Exclude<StaticFormField, { kind: `file` } | { kind: `text` }> =>
      field.kind !== `text` && field.kind !== `file`,
  );

  const lines = [
    ...valueFields.map(field => nonTextLine(field, answers[field.id])),
    ...plan.fields
      .filter((field): field is Extract<StaticFormField, { kind: `text` }> => field.kind === `text`)
      .map(field => textLine(field, answers[field.id])),
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
