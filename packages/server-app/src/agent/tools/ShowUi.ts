import type { AgentTool } from "@snappy/agent";

import { UiPlanSchema } from "@snappy/domain";
import { z } from "zod";

import { ToolCommon } from "../ToolCommon";

const argsSchema = z.object({ plan: UiPlanSchema.plan }).strict();

const run = ToolCommon.withParsedArgs(argsSchema, `invalid_ui_plan`, (data, toolCallId) => ({
  kind: `pending_ui`,
  plan: data.plan,
  toolCallId,
}));

export const showUi: AgentTool = {
  apiDescription: `Open a structured form in the app. One argument: { "plan": { "title", "fields" } }. Field kinds: text (optional placeholder, prompt); toggle (optional promptOn/promptOff); tabs_single | tabs_multi with required "options": [ { "label", "value", optional "prompt" } ]. Use when the user’s goal needs several structured inputs; after submit, answers arrive as the next context.`,
  argsSchema,
  name: `show_ui`,
  run,
  systemPrompt: [
    `### show_ui`,
    `Client renders a form; server validates "plan". After the user confirms, answers are delivered as structured JSON keyed by field id.`,
    `Shape: { "plan": { "title": string, "fields": [ { "id", "label", "kind", … } ] } }.`,
    `Kinds: "text", "toggle", "tabs_single", "tabs_multi" — each has a fixed shape; tabs kinds require "options": [ { "label", "value", optional "prompt" } ].`,
    `Call only with valid JSON arguments; no prose inside the tool call.`,
  ].join(`\n`),
};
