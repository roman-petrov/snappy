/* eslint-disable functional/no-expression-statements */
import type { AiImageQuality } from "@snappy/ai";

import type { PrismaClient } from "./generated/client";

export const DbUserSettings = (prisma: PrismaClient) => {
  const findByUserId = async (userId: string) =>
    (await prisma.userSettings.findUnique({ where: { userId } })) ?? undefined;

  const updateLlmModels = async (
    userId: string,
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

export type DbUserSettings = ReturnType<typeof DbUserSettings>;
