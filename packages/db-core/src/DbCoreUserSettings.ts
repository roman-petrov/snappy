/* eslint-disable functional/no-expression-statements */
import type { AiImageQuality } from "@snappy/ai";
import type { TypeWriterSpeed } from "@snappy/domain";

import type { PrismaClient } from "./generated/client";

import { DbCoreConvert } from "./DbCoreConvert";

export type DbCoreSettingsPatch = {
  aiTunnelDirect?: boolean;
  aiTunnelKey?: string;
  llmChatModel?: string;
  llmImageModel?: string;
  llmImageQuality?: AiImageQuality;
  llmSpeechRecognitionModel?: string;
  llmVisionModel?: string;
  typeWriterSpeed?: false | TypeWriterSpeed;
};

export const DbCoreUserSettings = (prisma: PrismaClient, userId: string) => {
  const find = async () => {
    const row = await prisma.userSettings.findUnique({ where: { userId } });
    if (row === null) {
      return undefined;
    }

    return {
      aiTunnelDirect: row.aiTunnelDirect,
      aiTunnelKey: row.aiTunnelKey,
      llmChatModel: DbCoreConvert.optional(row.llmChatModel),
      llmImageModel: DbCoreConvert.optional(row.llmImageModel),
      llmImageQuality: DbCoreConvert.optional(row.llmImageQuality),
      llmSpeechRecognitionModel: DbCoreConvert.optional(row.llmSpeechRecognitionModel),
      llmVisionModel: DbCoreConvert.optional(row.llmVisionModel),
      typeWriterSpeed: DbCoreConvert.optional(row.typeWriterSpeed),
    };
  };

  const update = async (patch: DbCoreSettingsPatch): Promise<void> => {
    const fields = {
      ...(patch.aiTunnelDirect === undefined ? {} : { aiTunnelDirect: patch.aiTunnelDirect }),
      ...(patch.aiTunnelKey === undefined ? {} : { aiTunnelKey: patch.aiTunnelKey }),
      ...(patch.llmChatModel === undefined ? {} : { llmChatModel: patch.llmChatModel }),
      ...(patch.llmImageModel === undefined ? {} : { llmImageModel: patch.llmImageModel }),
      ...(patch.llmImageQuality === undefined ? {} : { llmImageQuality: patch.llmImageQuality }),
      ...(patch.llmVisionModel === undefined ? {} : { llmVisionModel: patch.llmVisionModel }),
      ...(patch.llmSpeechRecognitionModel === undefined
        ? {}
        : { llmSpeechRecognitionModel: patch.llmSpeechRecognitionModel }),
      ...(patch.typeWriterSpeed === undefined
        ? {}
        : patch.typeWriterSpeed === false
          ? { typeWriterSpeed: `` }
          : { typeWriterSpeed: patch.typeWriterSpeed }),
    };

    await prisma.userSettings.upsert({ create: { userId, ...fields }, update: fields, where: { userId } });
  };

  return { find, update };
};

export type DbCoreUserSettings = ReturnType<typeof DbCoreUserSettings>;
