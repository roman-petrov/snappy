import type { AgentAiConfig, AgentAiOptions } from "@snappy/agents";

import { Ai, type AiImageQuality } from "@snappy/ai";
import { Locale } from "@snappy/ui";

export type UserSettingsForAi = {
  aiTunnelDirect: boolean;
  aiTunnelKey: string;
  llmChatModel: string;
  llmImageModel: string;
  llmImageQuality: AiImageQuality;
  llmSpeechRecognitionModel: string;
};

const tunnelUrl = () => `${globalThis.location.origin}/api/ai-tunnel/v1`;

export const agentAiFromSettings = (s: UserSettingsForAi): AgentAiConfig => {
  const key = s.aiTunnelKey.trim();
  const options: AgentAiOptions = s.aiTunnelDirect && key.length > 0 ? { aiTunnelKey: key } : { url: tunnelUrl() };

  return {
    models: {
      chat: s.llmChatModel,
      image: s.llmImageModel,
      imageQuality: s.llmImageQuality,
      speech: s.llmSpeechRecognitionModel,
    },
    options,
  };
};

export const aiForModelsList = async (s: UserSettingsForAi) =>
  Ai({ ...agentAiFromSettings(s).options, locale: Locale.effective() });
