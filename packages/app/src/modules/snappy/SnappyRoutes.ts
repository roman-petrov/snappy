import { PresetFlow, PresetHub, SnappyChat } from "./pages";

export const SnappyRoutes = {
  chat: { page: SnappyChat, path: `chat` },
  preset: {
    flow: { page: PresetFlow, path: `preset/:presetId/:flowId` },
    hub: { page: PresetHub, path: `preset/:presetId` },
  },
} as const;
