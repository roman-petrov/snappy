/* eslint-disable functional/no-expression-statements */
import type { PrismaClient } from "./generated/client";

import { DbTools } from "./core";

export type DbSnappySettings = {
  llmChatModel: null | string;
  llmImageModel: null | string;
  llmSpeechRecognitionModel: null | string;
  userId: number;
};

export const DbSnappySettings = (prisma: PrismaClient) => {
  const parse = (row: {
    llmChatModel: null | string;
    llmImageModel: null | string;
    llmSpeechRecognitionModel: null | string;
    userId: number;
  }) => ({
    llmChatModel: row.llmChatModel,
    llmImageModel: row.llmImageModel,
    llmSpeechRecognitionModel: row.llmSpeechRecognitionModel,
    userId: row.userId,
  });

  const findByUserId = async (userId: number) =>
    DbTools.parseNullable(await prisma.snappySettings.findUnique({ where: { userId } }), parse);

  const updateLlmModels = async (
    userId: number,
    patch: { llmChatModel?: string; llmImageModel?: string; llmSpeechRecognitionModel?: string },
  ): Promise<void> => {
    await prisma.snappySettings.upsert({
      create: {
        userId,
        ...(patch.llmChatModel === undefined ? {} : { llmChatModel: patch.llmChatModel }),
        ...(patch.llmImageModel === undefined ? {} : { llmImageModel: patch.llmImageModel }),
        ...(patch.llmSpeechRecognitionModel === undefined
          ? {}
          : { llmSpeechRecognitionModel: patch.llmSpeechRecognitionModel }),
      },
      update: {
        ...(patch.llmChatModel === undefined ? {} : { llmChatModel: patch.llmChatModel }),
        ...(patch.llmImageModel === undefined ? {} : { llmImageModel: patch.llmImageModel }),
        ...(patch.llmSpeechRecognitionModel === undefined
          ? {}
          : { llmSpeechRecognitionModel: patch.llmSpeechRecognitionModel }),
      },
      where: { userId },
    });
  };

  return { findByUserId, updateLlmModels };
};
