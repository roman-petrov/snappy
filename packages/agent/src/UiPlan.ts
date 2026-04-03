/* eslint-disable @typescript-eslint/no-base-to-string */
import type { UiField, UiFieldText, UiPlan as UiPlanShape, UiTabOption } from "@snappy/domain";
import type { PresetLocale } from "@snappy/presets";

const dash = (): string => `—`;

const toggleWord = (locale: PresetLocale, value: unknown): string => {
  const on = Boolean(value);

  return locale === `ru` ? (on ? `да` : `нет`) : on ? `yes` : `no`;
};

const optionByValue = (options: readonly UiTabOption[], value: string): UiTabOption | undefined =>
  options.find(option => option.value === value);

const promptOr = (prompt: string | undefined, otherwise: () => string): string => {
  const t = prompt?.trim();

  return t !== undefined && t !== `` ? t : otherwise();
};

const fragmentToggle = (field: Extract<UiField, { kind: `toggle` }>, locale: PresetLocale, raw: unknown): string => {
  const on = Boolean(raw);

  return promptOr(on ? field.promptOn : field.promptOff, () => `${field.label} = ${toggleWord(locale, raw)}`);
};

const fragmentTabsSingle = (field: Extract<UiField, { kind: `tabs_single` }>, raw: unknown): string => {
  const value = raw === undefined || raw === null ? `` : String(raw);
  const opt = optionByValue(field.options, value);
  if (opt === undefined) {
    return `${field.label} = ${value === `` ? dash() : value}`;
  }

  return promptOr(opt.prompt, () => `${field.label} = ${opt.label}`);
};

const fragmentTabsMulti = (field: Extract<UiField, { kind: `tabs_multi` }>, raw: unknown): string => {
  const selected = new Set(Array.isArray(raw) ? raw.map(String) : []);

  const parts = field.options
    .filter(option => selected.has(option.value))
    .map(option => promptOr(option.prompt, () => `${field.label} = ${option.label}`));

  if (parts.length === 0) {
    return `${field.label} = ${dash()}`;
  }

  return parts.join(`\n\n`);
};

const fragmentText = (field: Extract<UiField, { kind: `text` }>, raw: unknown): string => {
  if (raw === undefined || raw === null || String(raw).trim() === ``) {
    return `${field.label}\n${dash()}`;
  }
  const body = String(raw);
  const instruction = field.prompt?.trim();
  if (instruction !== undefined && instruction !== ``) {
    return `${instruction}\n\n${body}`;
  }

  return `${field.label}\n${body}`;
};

const nonTextFragment = (field: Exclude<UiField, UiFieldText>, locale: PresetLocale, raw: unknown): string => {
  switch (field.kind) {
    case `tabs_multi`: {
      return fragmentTabsMulti(field, raw);
    }
    case `tabs_single`: {
      return fragmentTabsSingle(field, raw);
    }
    case `toggle`: {
      return fragmentToggle(field, locale, raw);
    }
    default: {
      const exhaustive: never = field;

      return exhaustive;
    }
  }
};

const messageForModel = (plan: UiPlanShape, locale: PresetLocale, answers: Record<string, unknown>): string => {
  const nonText = plan.fields
    .filter((field): field is Exclude<UiField, UiFieldText> => field.kind !== `text`)
    .map(field => nonTextFragment(field, locale, answers[field.id]));

  const text = plan.fields
    .filter((field): field is UiFieldText => field.kind === `text`)
    .map(field => fragmentText(field, answers[field.id]));

  return [...nonText, ...text].join(`\n\n`);
};

export const UiPlan = { messageForModel };
