import type { AgentAiConfig } from "@snappy/snappy-sdk";

import type { trpc } from "./Api";

export type UserSettings = Awaited<ReturnType<typeof trpc.user.settings.get.query>>;

export const AgentAiFromSettings = (settings: UserSettings): AgentAiConfig => {
  const key = settings.aiTunnelKey.trim();

  const options =
    settings.aiTunnelDirect && key.length > 0
      ? { aiTunnelKey: key }
      : { url: `${globalThis.location.origin}/api/ai-tunnel/v1` };

  return {
    models: {
      chat: settings.llmChatModel,
      image: settings.llmImageModel,
      imageQuality: settings.llmImageQuality,
      speech: settings.llmSpeechRecognitionModel,
    },
    options,
  };
};
