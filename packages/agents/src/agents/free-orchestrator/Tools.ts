import type { FreeOrchestratorToolContext } from "./ToolContext";

import { AskTool } from "./tools/AskTool";
import { ChatTool } from "./tools/ChatTool";
import { ImageTool } from "./tools/ImageTool";
import { SendImageResultTool } from "./tools/SendImageResultTool";
import { SendTextResultTool } from "./tools/SendTextResultTool";
import { StorageListTool } from "./tools/StorageListTool";
import { StorageReadTool } from "./tools/StorageReadTool";

const list = (context: FreeOrchestratorToolContext) =>
  ({
    "free-orchestrator": {
      "ask": AskTool(context),
      "chat": ChatTool(context),
      "image": ImageTool(context),
      "send-image-result": SendImageResultTool(context),
      "send-text-result": SendTextResultTool(context),
      "storage-list": StorageListTool(context),
      "storage-read": StorageReadTool(context),
    },
  }) as const;

export const Tools = { list };
