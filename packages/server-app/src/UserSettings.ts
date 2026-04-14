/* eslint-disable functional/no-expression-statements */
import type { Ai } from "@snappy/ai";
import type { Db } from "@snappy/db";
import type { ApiUserLlmSettingsBody, ApiUserLlmSettingsResult } from "@snappy/server-api";

import { AiConstants, type AiImageQuality } from "@snappy/domain";

export const UserSettings = ({ ai, userSettings }: { ai: Ai; userSettings: Db[`userSettings`] }) => {
  const imageQualitySet = new Set<string>(AiConstants.imageQuality);
  const [defaultImageQuality] = AiConstants.imageQuality;

  const isImageQuality = (value: null | string | undefined): value is AiImageQuality =>
    value !== undefined && value !== null && imageQualitySet.has(value);

  const chatNames = new Set(ai.models.filter(model => model.type === `chat`).map(model => model.name));
  const imageNames = new Set(ai.models.filter(model => model.type === `image`).map(model => model.name));
  const speechNames = new Set(ai.models.filter(model => model.type === `speech-recognition`).map(model => model.name));
  const defaultChat = ai.models.find(model => model.type === `chat`)?.name;
  const defaultImage = ai.models.find(model => model.type === `image`)?.name;
  const defaultSpeech = ai.models.find(model => model.type === `speech-recognition`)?.name;

  const get = async (userId: number): Promise<ApiUserLlmSettingsResult> => {
    if (defaultChat === undefined || defaultImage === undefined || defaultSpeech === undefined) {
      return { status: `badRequest` };
    }

    const row = await userSettings.findByUserId(userId);

    return {
      llmChatModel: row?.llmChatModel ?? defaultChat,
      llmImageModel: row?.llmImageModel ?? defaultImage,
      llmImageQuality: isImageQuality(row?.llmImageQuality) ? row.llmImageQuality : defaultImageQuality,
      llmSpeechRecognitionModel: row?.llmSpeechRecognitionModel ?? defaultSpeech,
      maxImagePromptLength: ai.maxImagePromptLength,
      maxSpeechFileMegaBytes: ai.maxSpeechFileMegaBytes,
      status: `ok`,
    };
  };

  const set = async (userId: number, body: ApiUserLlmSettingsBody): Promise<ApiUserLlmSettingsResult> => {
    if (body.llmChatModel !== undefined && !chatNames.has(body.llmChatModel)) {
      return { status: `badRequest` };
    }
    if (body.llmImageModel !== undefined && !imageNames.has(body.llmImageModel)) {
      return { status: `badRequest` };
    }
    if (body.llmImageQuality !== undefined && !isImageQuality(body.llmImageQuality)) {
      return { status: `badRequest` };
    }
    if (body.llmSpeechRecognitionModel !== undefined && !speechNames.has(body.llmSpeechRecognitionModel)) {
      return { status: `badRequest` };
    }
    if (
      body.llmChatModel === undefined &&
      body.llmImageQuality === undefined &&
      body.llmImageModel === undefined &&
      body.llmSpeechRecognitionModel === undefined
    ) {
      return get(userId);
    }

    await userSettings.updateLlmModels(userId, body);

    return get(userId);
  };

  return { get, set };
};

export type UserSettings = ReturnType<typeof UserSettings>;
