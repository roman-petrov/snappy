/* eslint-disable functional/no-expression-statements */
import type { DbUser } from "@snappy/db";

import { AiConstants, AiModels } from "@snappy/ai";
import { TypeWriterSpeeds } from "@snappy/domain";
import { z } from "zod";

import { AppTrpcAuth } from "./AppTrpc";

const llmImageQualitySchema = z.enum(AiConstants.imageQuality);
const typeWriterSpeedSchema = z.enum(TypeWriterSpeeds);
const typeWriterSpeedInput = z.union([typeWriterSpeedSchema, z.literal(false)]);

const load = async (user: DbUser) => {
  const row = await user.settings.find();
  const aiTunnelDirect = row?.aiTunnelDirect ?? false;
  const aiTunnelKey = row?.aiTunnelKey ?? ``;
  const llmChatModel = row?.llmChatModel ?? AiModels.fallback.chat.name;
  const llmImageModel = row?.llmImageModel ?? AiModels.fallback.image.name;
  const llmImageQuality = llmImageQualitySchema.catch(AiConstants.defaults.imageQuality).parse(row?.llmImageQuality);
  const llmVisionModel = row?.llmVisionModel ?? AiModels.fallback.vision.name;
  const llmSpeechRecognitionModel = row?.llmSpeechRecognitionModel ?? AiModels.fallback.speechRecognition.name;
  const typeWriterSpeedStored = row?.typeWriterSpeed ?? ``;

  const typeWriterSpeed =
    typeWriterSpeedStored === ``
      ? undefined
      : typeWriterSpeedSchema.parse(typeWriterSpeedStored === `normal` ? `medium` : typeWriterSpeedStored);

  return {
    aiTunnelDirect,
    aiTunnelKey,
    llmChatModel,
    llmImageModel,
    llmImageQuality,
    llmSpeechRecognitionModel,
    llmVisionModel,
    typeWriterSpeed,
  };
};

const trpc = {
  get: AppTrpcAuth.query(async ({ ctx }) => load(ctx.dbUser)),
  set: AppTrpcAuth.input(
    z.object({
      aiTunnelDirect: z.boolean().optional(),
      aiTunnelKey: z.string().optional(),
      llmChatModel: z.string().optional(),
      llmImageModel: z.string().optional(),
      llmImageQuality: llmImageQualitySchema.optional(),
      llmSpeechRecognitionModel: z.string().optional(),
      llmVisionModel: z.string().optional(),
      typeWriterSpeed: typeWriterSpeedInput.optional(),
    }),
  ).mutation(async ({ ctx, input }) => {
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
      return load(ctx.dbUser);
    }

    const aiTunnelKey = input.aiTunnelKey === undefined ? undefined : input.aiTunnelKey.trim();

    await ctx.dbUser.settings.update({ ...input, ...(aiTunnelKey === undefined ? {} : { aiTunnelKey }) });

    return load(ctx.dbUser);
  }),
};

export const UserSettings = { load, trpc };

export type UserSettings = typeof UserSettings;
