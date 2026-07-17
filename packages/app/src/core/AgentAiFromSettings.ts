import type { AgentAiConfig } from "@snappy/snappy";

import { Ai } from "@snappy/ai";

import type { UserSettings } from "../data";

export const AgentAiFromSettings = (settings: UserSettings): AgentAiConfig => {
  const key = settings.aiTunnelKey.trim();

  const ai = Ai(
    settings.aiTunnelDirect && key.length > 0
      ? { aiTunnelKey: key }
      : { url: `${globalThis.location.origin}/api/ai-tunnel/v1` },
  );

  return {
    models: {
      chat: ai.chat(settings.llmChatModel),
      image: ai.image(settings.llmImageModel),
      imageQuality: settings.llmImageQuality,
      speech: ai.speech(settings.llmSpeechRecognitionModel),
      vision: ai.vision(settings.llmVisionModel),
    },
  };
};
