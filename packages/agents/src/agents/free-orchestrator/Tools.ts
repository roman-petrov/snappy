import type { FreeOrchestratorToolContext } from "./ToolContext";

import { ChatTool } from "./tools/ChatTool";
import { ImageTool } from "./tools/ImageTool";
import { SendImageResultTool } from "./tools/SendImageResultTool";
import { SendTextResultTool } from "./tools/SendTextResultTool";
import { ShowStaticFormTool } from "./tools/ShowStaticFormTool";
import { StorageListTool } from "./tools/StorageListTool";
import { StorageReadTool } from "./tools/StorageReadTool";

const list = (context: FreeOrchestratorToolContext) =>
  ({
    "free-orchestrator": {
      "chat": ChatTool(context),
      "image": ImageTool(context),
      "send-image-result": SendImageResultTool(context),
      "send-text-result": SendTextResultTool(context),
      "show-static-form": ShowStaticFormTool(context),
      "storage-list": StorageListTool(context),
      "storage-read": StorageReadTool(context),
    },
  }) as const;

export const Tools = { list };
