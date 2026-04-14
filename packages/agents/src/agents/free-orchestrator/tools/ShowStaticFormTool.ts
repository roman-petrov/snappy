import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

import { StaticForm } from "../../../common/components";
import { UserMessage } from "../../../common/UserMessage";
import { staticFormPlanSchema } from "../../../core";

export const ShowStaticFormTool: FreeOrchestratorAgentTool = ({ agentContext, input }) =>
  AgentTool({
    description: [
      `Render the next StaticForm step with a new set of fields.`,
      `IMPORTANT: request user clarifications only via showStaticForm, not via free assistant text.`,
      `Field priority: tabs_single -> tabs_multi -> toggle -> text.`,
      `Use text fields only when truly necessary.`,
      `Field types: default to tabs_single/tabs_multi/toggle; use text only for unbounded values or when raw long user text is required; otherwise text is forbidden.`,
      `If unique semantic grounding is needed (concept, metaphor, theme, key image, context), add a short text field first, then refine via choices.`,
      `For EVERY showStaticForm call, every field label and every option label MUST start with exactly one leading emoji (emoji only at position 1); if not, rewrite labels before sending the tool call.`,
      `Formal constraints: tabs_single/tabs_multi must always include options (minimum 2).`,
      `Do not build text-only step when choices can be offered.`,
    ].join(` `),
    formatCall: ({ title }, status, locale) =>
      locale === `ru`
        ? status === `running`
          ? `Показываю форму: ${title}`
          : `Показал форму: ${title}`
        : status === `running`
          ? `Showing form: ${title}`
          : `Showed form: ${title}`,
    run: async ({ meta, uiPlan }) => {
      const formAnswers = await input.hostTools.ask({ component: StaticForm, props: { plan: uiPlan } });
      if (agentContext.isStopped() || input.isStopped()) {
        return ``;
      }

      const mainPrompt =
        (meta?.prompt ?? ``).trim() === `` ? `Build the next UI request from user answers.` : (meta?.prompt ?? ``);

      return UserMessage.build({ answers: formAnswers, locale: `en`, mainPrompt, plan: uiPlan });
    },
    schema: z.object({
      description: z.string().optional().describe(`Short note for the user shown near the form title.`),
      meta: z
        .object({
          constraints: z.array(z.string()).optional().describe(`Additional constraints for building the next request.`),
          goal: z.string().optional().describe(`Goal of the current clarification step.`),
          outputFormat: z.string().optional().describe(`Expected format of the final output.`),
          prompt: z.string().optional().describe(`Instruction used to turn answers into the next user message.`),
        })
        .describe(`Optional metadata used to build the next user request.`)
        .optional(),
      title: z.string().min(1).describe(`Form title displayed to the user.`),
      uiPlan: staticFormPlanSchema.describe(`Static form plan describing fields and options for this step.`),
    }),
  });
