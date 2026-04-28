/* eslint-disable functional/no-expression-statements */
import type { DbUserSettings } from "@snappy/db";
import type { ApiUserSettingsBody, ApiUserSettingsResult } from "@snappy/server-api";

import { type Ai, AiConstants, type AiImageQuality } from "@snappy/ai";

import { HttpError } from "./HttpError";

export type UserSettingsConfig = { ai: Ai; userSettings: DbUserSettings };

export const UserSettings = ({ ai, userSettings }: UserSettingsConfig) => {
  const required = <T>(value: T | undefined): T => value ?? HttpError.badRequest();
  const imageQualitySet = new Set<string>(AiConstants.imageQuality);
  const { defaults, models } = ai;
  const defaultImageQuality = defaults.imageQuality;

  const isImageQuality = (value: null | string | undefined): value is AiImageQuality =>
    value !== undefined && value !== null && imageQualitySet.has(value);

  const chatNames = new Set(models.filter(model => model.type === `chat`).map(model => model.name));
  const imageNames = new Set(models.filter(model => model.type === `image`).map(model => model.name));
  const speechNames = new Set(models.filter(model => model.type === `speech-recognition`).map(model => model.name));

  const defaultChat = chatNames.has(defaults.models.chat)
    ? defaults.models.chat
    : models.find(model => model.type === `chat`)?.name;

  const defaultImage = imageNames.has(defaults.models.image)
    ? defaults.models.image
    : models.find(model => model.type === `image`)?.name;

  const defaultSpeech = speechNames.has(defaults.models.speechRecognition)
    ? defaults.models.speechRecognition
    : models.find(model => model.type === `speech-recognition`)?.name;

  const chat = required(defaultChat);
  const image = required(defaultImage);
  const speech = required(defaultSpeech);

  const fallbackModel = (value: null | string | undefined, names: Set<string>, fallback: string) =>
    value !== undefined && value !== null && names.has(value) ? value : fallback;

  const get = async (userId: string): Promise<ApiUserSettingsResult> => {
    const row = await userSettings.findByUserId(userId);

    return {
      llmChatModel: fallbackModel(row?.llmChatModel, chatNames, chat),
      llmImageModel: fallbackModel(row?.llmImageModel, imageNames, image),
      llmImageQuality: isImageQuality(row?.llmImageQuality) ? row.llmImageQuality : defaultImageQuality,
      llmSpeechRecognitionModel: fallbackModel(row?.llmSpeechRecognitionModel, speechNames, speech),
    };
  };

  const set = async (userId: string, body: ApiUserSettingsBody): Promise<ApiUserSettingsResult> => {
    if (
      (body.llmChatModel !== undefined && !chatNames.has(body.llmChatModel)) ||
      (body.llmImageModel !== undefined && !imageNames.has(body.llmImageModel)) ||
      (body.llmImageQuality !== undefined && !isImageQuality(body.llmImageQuality)) ||
      (body.llmSpeechRecognitionModel !== undefined && !speechNames.has(body.llmSpeechRecognitionModel))
    ) {
      HttpError.badRequest();
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
