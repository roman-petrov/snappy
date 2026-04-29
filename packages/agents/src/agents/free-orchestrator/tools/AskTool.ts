import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

import { staticFormPlanSchema } from "../../../core";

export const AskTool: FreeOrchestratorAgentTool = ({ agentContext, askForm, isStopped }) =>
  AgentTool({
    description: [
      [`role`, `Show the next clarification step with a new set of questions and options.`],
      [`field_priority`, `Prefer clear selectable choices first: tabs_single -> tabs_multi -> toggle -> text.`],
      [
        `text_fields`,
        `Use text fields only when choices cannot capture the needed answer (free input, long source text, unique context).`,
      ],
      [
        `grounding`,
        `If semantic grounding is needed (concept, metaphor, theme, key image, context), first collect a short text input, then continue with structured choices.`,
      ],
      [
        `constraints`,
        `tabs_single and tabs_multi must always include options (minimum 2). Do not build text-only steps when meaningful choices can be offered.`,
      ],
      [
        `IMPORTANT`,
        `Request user clarifications only via ask, not via free assistant text.
For EVERY ask tool call, validate the call arguments before sending: each field label in plan.fields MUST start with exactly one leading emoji (emoji at position 1 only), and each option label inside tabs_single/tabs_multi field options MUST also start with exactly one leading emoji. If any label does not match, rewrite the call arguments before sending.`,
      ],
    ],
    formatCall: ({ title }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Запрашиваю уточнения: ${title}`
          : `Уточнения запрошены: ${title}`
        : status === `running`
          ? `Asking for clarifications: ${title}`
          : `Clarifications requested: ${title}`,
    run: async ({ plan }) => {
      const formAnswers = await askForm(plan);
      if (agentContext.isStopped() || isStopped()) {
        return ``;
      }

      return JSON.stringify({ answers: formAnswers }, undefined, 2);
    },
    schema: z.object({
      description: z.string().optional().describe(`Short note for the user shown near the form title.`),
      plan: staticFormPlanSchema.describe(`Plan describing clarification fields and options for this step.`),
      title: z.string().min(1).describe(`Form title displayed to the user.`),
    }),
  });
