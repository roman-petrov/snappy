import { SnappyChat } from "./chat";
import { PresetPicker } from "./preset";
import { StaticChat } from "./static";

export const SnappyRoutes = {
  chat: { page: SnappyChat, path: `chat/:presetId` },
  preset: {
    chat: { page: SnappyChat, path: `preset/:presetId/chat` },
    root: { page: PresetPicker, path: `preset/:presetId` },
    static: { page: StaticChat, path: `preset/:presetId/static` },
  },
} as const;
