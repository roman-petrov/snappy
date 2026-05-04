import type { FreeOrchestratorToolContext } from "./ToolContext";

import { AskTool } from "./tools/AskTool";
import { GenerateImageTool } from "./tools/GenerateImageTool";
import { GenerateTextTool } from "./tools/GenerateTextTool";

const list = (context: FreeOrchestratorToolContext) =>
  ({
    "free-orchestrator": {
      "ask": AskTool(context),
      "generate-image": GenerateImageTool(context),
      "generate-text": GenerateTextTool(context),
    },
  }) as const;

export const Tools = { list };
