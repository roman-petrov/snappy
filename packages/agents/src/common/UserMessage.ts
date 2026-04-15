import { _ } from "@snappy/core";

import type { AgentLocale } from "../Types";
import type { StaticFormField, StaticFormPlan, StaticTabOption } from "./Meta";

export type UserMessageBuildInput = {
  answers: Record<string, unknown>;
  locale: AgentLocale;
  mainPrompt: string;
  plan: StaticFormPlan;
};

const dash = `—`;

const toggleWord = (locale: AgentLocale, value: unknown) => {
  const on = Boolean(value);

  return locale === `ru` ? (on ? `да` : `нет`) : on ? `yes` : `no`;
};

const optionByValue = (options: readonly StaticTabOption[], value: string) =>
  options.find(option => option.value === value);

const promptOr = (prompt: string | undefined, otherwise: () => string) => {
  const t = prompt?.trim();

  return t !== undefined && t !== `` ? t : otherwise();
};

const fragmentTabsSingle = (field: Extract<StaticFormField, { kind: `tabs_single` }>, raw: unknown) => {
  const value = _.isString(raw) ? raw : ``;
  const opt = optionByValue(field.options, value);
  if (opt === undefined) {
    return `${field.label} = ${value === `` ? dash : value}`;
  }

  return promptOr(opt.prompt, () => `${field.label} = ${opt.label}`);
};

const toggleBulletLine = (field: Extract<StaticFormField, { kind: `toggle` }>, locale: AgentLocale, raw: unknown) => {
  const on = Boolean(raw);
  const onText = field.promptOn?.trim();
  const offText = field.promptOff?.trim();

  if (on && onText !== undefined && onText !== ``) {
    return onText;
  }
  if (!on && offText !== undefined && offText !== ``) {
    return offText;
  }

  return `${field.label}: ${toggleWord(locale, raw)}`;
};

const tabsMultiBulletLines = (field: Extract<StaticFormField, { kind: `tabs_multi` }>, raw: unknown): string[] => {
  const selected = new Set(_.isArray(raw) ? raw.filter(_.isString) : []);

  return field.options
    .filter(option => selected.has(option.value))
    .map(option => promptOr(option.prompt, () => `${field.label} = ${option.label}`));
};

const trimToText = (raw: unknown) => (raw === undefined || raw === null ? `` : _.isString(raw) ? raw.trim() : ``);

const nonTextBulletLine = (
  field: Exclude<StaticFormField, { kind: `file` } | { kind: `text` }>,
  locale: AgentLocale,
  raw: unknown,
) => {
  switch (field.kind) {
    case `tabs_multi`: {
      return tabsMultiBulletLines(field, raw);
    }
    case `tabs_single`: {
      return [fragmentTabsSingle(field, raw)];
    }
    case `toggle`: {
      return [toggleBulletLine(field, locale, raw)];
    }
    default: {
      const exhaustive: never = field;

      return exhaustive;
    }
  }
};

const textEmpty = (raw: unknown) => trimToText(raw) === ``;

const textBlock = (field: Extract<StaticFormField, { kind: `text` }>, raw: unknown) => {
  const instruction = field.prompt?.trim() ?? field.label;
  const body = trimToText(raw);

  return body === `` ? `${instruction}\n${dash}` : `${instruction}\n\n${body}`;
};

const build = ({ answers, locale, mainPrompt, plan }: UserMessageBuildInput) => {
  const head = mainPrompt.trim();

  const nonText = plan.fields.filter(
    (field): field is Exclude<StaticFormField, { kind: `file` } | { kind: `text` }> =>
      field.kind !== `text` && field.kind !== `file`,
  );

  const textFields = plan.fields.filter(
    (field): field is Extract<StaticFormField, { kind: `text` }> => field.kind === `text`,
  );

  const parameterLines = nonText.flatMap(field =>
    nonTextBulletLine(field, locale, answers[field.id]).map(line => `- ${line}`),
  );

  const textLines = textFields
    .filter(field => !(field.omitWhenEmpty === true && textEmpty(answers[field.id])))
    .map(field => `- ${textBlock(field, answers[field.id])}`);

  return [
    head,
    ...(parameterLines.length > 0 ? [``, ...parameterLines] : []),
    ...(textLines.length > 0 ? [``, ...textLines] : []),
  ].join(`\n`);
};

export const UserMessage = { build };
