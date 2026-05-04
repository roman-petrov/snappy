import { AgentTool } from "@snappy/agent";
import { z } from "zod";

import type { FreeOrchestratorAgentTool } from "../Types";

export const GenerateTextTool: FreeOrchestratorAgentTool = ({ streamTextArtifact }) =>
  AgentTool({
    description: [
      `One call runs a single host chat-model generation.`,
      `Output appears in the feed as a text card with live streaming in the UI.`,
      `The tool returns only an English success or error message to the agent — not the generated text.`,
      `There is no separate storage or publish step.`,
      `Use only for an intermediate or final text artifact built from the collected user contract — not for short UI-only status messages.`,
    ].join(` `),
    run: async ({ prompt }) => {
      const html = await streamTextArtifact(prompt);
      if (html.trim() === ``) {
        return { error: `Text was not generated.` };
      }

      return `Text generation completed successfully.`;
    },
    schema: z.object({
      prompt: z
        .string()
        .min(1)
        .describe(
          `Full detailed prompt passed to the chat generation model: lossless compilation of user-selected settings (goal, audience, semantic core, style, tone, format, structure, constraints, formatting). Not a short file label — this exact string is sent to the model.`,
        ),
    }),
  });
