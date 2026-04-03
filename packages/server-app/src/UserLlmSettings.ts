/* eslint-disable functional/no-expression-statements */
import type { Db } from "@snappy/db";
import type { ApiUserLlmSettingsBody, ApiUserLlmSettingsResult } from "@snappy/server-api";

export const UserLlmSettings = ({
  ai,
  snappySettings,
}: {
  ai: {
    maxImagePromptLength: number;
    maxSpeechFileMegaBytes: number;
    models: { name: string; type: `chat` | `image` | `speech-recognition` }[];
  };
  snappySettings: Db[`snappySettings`];
}) => {
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

    const row = await snappySettings.findByUserId(userId);

    return {
      llmChatModel: row?.llmChatModel ?? defaultChat,
      llmImageModel: row?.llmImageModel ?? defaultImage,
      llmSpeechRecognitionModel: row?.llmSpeechRecognitionModel ?? defaultSpeech,
      maxPromptImageLength: ai.maxImagePromptLength,
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
    if (body.llmSpeechRecognitionModel !== undefined && !speechNames.has(body.llmSpeechRecognitionModel)) {
      return { status: `badRequest` };
    }
    if (
      body.llmChatModel === undefined &&
      body.llmImageModel === undefined &&
      body.llmSpeechRecognitionModel === undefined
    ) {
      return get(userId);
    }

    await snappySettings.updateLlmModels(userId, {
      ...(body.llmChatModel === undefined ? {} : { llmChatModel: body.llmChatModel }),
      ...(body.llmImageModel === undefined ? {} : { llmImageModel: body.llmImageModel }),
      ...(body.llmSpeechRecognitionModel === undefined
        ? {}
        : { llmSpeechRecognitionModel: body.llmSpeechRecognitionModel }),
    });

    return get(userId);
  };

  return { get, set };
};

export type UserLlmSettings = ReturnType<typeof UserLlmSettings>;
