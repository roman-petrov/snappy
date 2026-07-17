import type { Db, DbSettings, DbUser } from "@snappy/db";

import { AiConstants } from "@snappy/ai";
import { TypeWriterSpeeds } from "@snappy/domain";
import { z } from "zod";

import { RpcScope } from "./RpcContract";

export const UserSettings = (db: Db) => {
  const typeWriterSpeedSchema = z.enum(TypeWriterSpeeds);

  const settingsSchema = z.object({
    aiTunnelDirect: z.boolean(),
    aiTunnelKey: z.string(),
    llmChatModel: z.string(),
    llmImageModel: z.string(),
    llmImageQuality: z.enum(AiConstants.imageQuality),
    llmSpeechRecognitionModel: z.string(),
    llmVisionModel: z.string(),
    typeWriterSpeed: typeWriterSpeedSchema.optional(),
  }) satisfies z.ZodType<DbSettings>;

  const patchSchema = settingsSchema
    .partial()
    .extend({ typeWriterSpeed: z.union([typeWriterSpeedSchema, z.literal(false)]).optional() });

  const { doc } = RpcScope;
  const read = async (user: DbUser) => user.settings.read();

  const rpc = {
    get: doc(db.settings, async ({ dbUser }) => read(dbUser)),
    set: doc(db.settings, patchSchema, async ({ dbUser, input }) => {
      if (
        input.aiTunnelDirect === undefined &&
        input.aiTunnelKey === undefined &&
        input.llmChatModel === undefined &&
        input.llmImageQuality === undefined &&
        input.llmImageModel === undefined &&
        input.llmVisionModel === undefined &&
        input.llmSpeechRecognitionModel === undefined &&
        input.typeWriterSpeed === undefined
      ) {
        return read(dbUser);
      }

      const current = await read(dbUser);
      const aiTunnelKey = input.aiTunnelKey === undefined ? current.aiTunnelKey : input.aiTunnelKey.trim();

      const typeWriterSpeed =
        input.typeWriterSpeed === undefined
          ? current.typeWriterSpeed
          : input.typeWriterSpeed === false
            ? undefined
            : input.typeWriterSpeed;

      return dbUser.settings.update({
        aiTunnelDirect: input.aiTunnelDirect ?? current.aiTunnelDirect,
        aiTunnelKey,
        llmChatModel: input.llmChatModel ?? current.llmChatModel,
        llmImageModel: input.llmImageModel ?? current.llmImageModel,
        llmImageQuality: input.llmImageQuality ?? current.llmImageQuality,
        llmSpeechRecognitionModel: input.llmSpeechRecognitionModel ?? current.llmSpeechRecognitionModel,
        llmVisionModel: input.llmVisionModel ?? current.llmVisionModel,
        ...(typeWriterSpeed === undefined ? {} : { typeWriterSpeed }),
      });
    }),
  };

  return { read, rpc };
};

export type UserSettings = ReturnType<typeof UserSettings>;
