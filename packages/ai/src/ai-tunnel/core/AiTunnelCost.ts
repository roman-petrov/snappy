/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/naming-convention */
import { _ } from "@snappy/core";

import type { OpenAiChatUsage, OpenAiEmbedderUsage, OpenAiImageUsage, OpenAiSpeechRecognitionUsage } from "../../core";

const rub = (value: undefined | { cost_rub?: number }, errorCode: string) => {
  if (!_.isNumber(value?.cost_rub)) {
    throw new TypeError(errorCode);
  }

  return value.cost_rub;
};

const chat = (usage: OpenAiChatUsage | undefined) =>
  rub(usage as undefined | { cost_rub?: number }, `ai_tunnel_chat_cost_missing`);

const embedder = (usage: OpenAiEmbedderUsage | undefined) =>
  rub(usage as undefined | { cost_rub?: number }, `ai_tunnel_embedder_cost_missing`);

const image = (usage: OpenAiImageUsage | undefined) =>
  rub(usage as undefined | { cost_rub?: number }, `ai_tunnel_image_cost_missing`);

const speechRecognition = (usage: OpenAiSpeechRecognitionUsage | undefined) =>
  rub(usage as undefined | { cost_rub?: number }, `ai_tunnel_speech_cost_missing`);

export const AiTunnelCost = { chat, embedder, image, speechRecognition };
