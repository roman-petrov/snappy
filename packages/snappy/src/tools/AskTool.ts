import { AgentTool } from "@snappy/agent";
import { StaticFormPlanSchema } from "@snappy/snappy-sdk";

import type { SnappyToolFactory } from "../SnappyTypes";

export const AskTool: SnappyToolFactory = ({ feed, isStopped }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when critical requirements are missing or ambiguous and you need structured user clarification before continuing.`,
      ],
      [
        `input`,
        `Pass a concise clarification form plan (optional title + fields) and ask only for information required for the next step.`,
      ],
      [
        `output`,
        `Returns structured answers as JSON. Use these answers as the source of truth for subsequent tool calls.`,
      ],
    ],
    execute: async plan => {
      if (isStopped()) {
        return ``;
      }
      const formAnswers = await feed.ask(plan);

      return isStopped() ? `` : JSON.stringify({ answers: formAnswers }, undefined, 2);
    },
    inputSchema: StaticFormPlanSchema,
  });
