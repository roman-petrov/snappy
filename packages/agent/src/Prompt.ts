import { Json } from "@snappy/core";
import { type PresetLocale, Presets } from "@snappy/presets";

import { UiPlan } from "./UiPlan";

const locale = [
  `**Language:** Write every assistant reply to the user in **Russian** (normal chat text).`,
  `Exception: tool/function calls — use the exact tool names and JSON-only arguments as specified below; no natural language inside tool calls.`,
].join(`\n`);

const roleFree = [
  `From the user’s messages, infer the intended outcome and which levers matter (scope, constraints, style, format, data, visual parameters — whatever fits the task).`,
  `Use **show_ui** only when you need several explicit fields or choices; otherwise answer in chat.`,
  `After a form is submitted, rely on the payload described above; do not call **show_ui** again for the same task unless the ask changes.`,
  `Tool calls: JSON arguments only, no prose inside the call.`,
].join(`\n`);

const rolePreset = [
  `The latest user message describes what to produce.`,
  `Follow it together with **Generation instructions** in this system prompt.`,
].join(`\n`);

const uiGenerationFree = `**Free mode** (after **show_ui**): The client sends JSON { "answers": { … } } as a user or tool message; treat "answers" as authoritative.`;
const uiGenerationPreset = `**Preset mode:** The latest user message states the task and constraints. Use it together with **Generation instructions** below.`;

const generationInstructions = (body: string): string =>
  [
    `### Generation instructions`,
    body.trim(),
    ``,
    `Follow the latest user message together with these instructions.`,
  ].join(`\n`);

type IntroInput = { mode: `free` | `preset`; presetGenerationPrompt: string | undefined };

const answersPayload = (answers: Record<string, unknown>): string => Json.stringify({ answers });

const intro = ({ mode, presetGenerationPrompt }: IntroInput): string => {
  const uiGeneration = mode === `free` ? uiGenerationFree : uiGenerationPreset;
  const role = mode === `free` ? roleFree : rolePreset;

  const presetPart =
    mode === `preset` && presetGenerationPrompt !== undefined && presetGenerationPrompt.trim() !== ``
      ? generationInstructions(presetGenerationPrompt)
      : ``;

  return [locale, ``, uiGeneration, ``, role, presetPart].filter(part => part.trim() !== ``).join(`\n\n`);
};

const outro = (mode: `free` | `preset`): string =>
  mode === `free` ? `Follow the tool sections below for argument shapes and behavior.` : ``;

const presetPayload = (presetId: string, loc: PresetLocale, answers: Record<string, unknown>): string | undefined => {
  const source = Presets.list().find(s => s.id === presetId);
  if (source === undefined) {
    return undefined;
  }

  const plan = source[loc].uiPlan;

  return UiPlan.messageForModel(plan, loc, answers);
};

const systemBase = (introBlock: string, toolSystemPrompts: readonly string[], outroBlock: string): string =>
  [introBlock, ``, ...toolSystemPrompts, ``, outroBlock].join(`\n`);

export const Prompt = {
  answersPayload,
  intro,
  locale,
  outro,
  presetPayload,
  roleFree,
  rolePreset,
  systemBase,
  uiGenerationFree,
  uiGenerationPreset,
};
