import type { TrpcOutputs } from "@snappy/app-server-api";
import type { AgentAiConfig } from "@snappy/snappy-sdk";

import { AiConstants } from "@snappy/ai";

export type UserSettings = TrpcOutputs[`user`][`settings`][`get`];

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
      look: AiConstants.defaults.models.look,
      speech: settings.llmSpeechRecognitionModel,
    },
    options,
  };
};
