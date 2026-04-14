/* eslint-disable functional/no-expression-statements */
import type { AiImageQuality } from "@snappy/domain";

import type { PrismaClient } from "./generated/client";

export const DbUserSettings = (prisma: PrismaClient) => {
  const findByUserId = async (userId: number) =>
    (await prisma.userSettings.findUnique({ where: { userId } })) ?? undefined;

  const updateLlmModels = async (
    userId: number,
    patch: {
      llmChatModel?: string;
      llmImageModel?: string;
      llmImageQuality?: AiImageQuality;
      llmSpeechRecognitionModel?: string;
    },
  ): Promise<void> => {
    const modelPatch = {
      ...(patch.llmChatModel === undefined ? {} : { llmChatModel: patch.llmChatModel }),
      ...(patch.llmImageModel === undefined ? {} : { llmImageModel: patch.llmImageModel }),
      ...(patch.llmImageQuality === undefined ? {} : { llmImageQuality: patch.llmImageQuality }),
      ...(patch.llmSpeechRecognitionModel === undefined
        ? {}
        : { llmSpeechRecognitionModel: patch.llmSpeechRecognitionModel }),
    };

    await prisma.userSettings.upsert({ create: { userId, ...modelPatch }, update: modelPatch, where: { userId } });
  };

  return { findByUserId, updateLlmModels };
};
