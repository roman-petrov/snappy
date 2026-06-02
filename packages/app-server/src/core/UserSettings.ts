/* eslint-disable functional/no-expression-statements */
import type { DbUserSettings } from "@snappy/db";

import { AiConstants } from "@snappy/ai";
import { TypeWriterSpeeds } from "@snappy/domain";
import { z } from "zod";

import { AppTrpcAuth } from "./AppTrpc";

export type UserSettingsConfig = { userSettings: DbUserSettings };

export const UserSettings = ({ userSettings }: UserSettingsConfig) => {
  const llmImageQualitySchema = z.enum(AiConstants.imageQuality);
  const typeWriterSpeedSchema = z.enum(TypeWriterSpeeds);
  const typeWriterSpeedInput = z.union([typeWriterSpeedSchema, z.literal(false)]);

  const load = async (userId: string) => {
    const row = await userSettings.findByUserId(userId);
    const aiTunnelDirect = row?.aiTunnelDirect ?? false;
    const aiTunnelKey = row?.aiTunnelKey ?? ``;
    const llmChatModel = row?.llmChatModel ?? AiConstants.defaults.models.chat;
    const llmImageModel = row?.llmImageModel ?? AiConstants.defaults.models.image;
    const llmImageQuality = llmImageQualitySchema.catch(AiConstants.defaults.imageQuality).parse(row?.llmImageQuality);
    const llmSpeechRecognitionModel = row?.llmSpeechRecognitionModel ?? AiConstants.defaults.models.speechRecognition;
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
      typeWriterSpeed,
    };
  };

  const trpc = {
    get: AppTrpcAuth.query(async ({ ctx }) => load(ctx.userId)),
    set: AppTrpcAuth.input(
      z.object({
        aiTunnelDirect: z.boolean().optional(),
        aiTunnelKey: z.string().optional(),
        llmChatModel: z.string().optional(),
        llmImageModel: z.string().optional(),
        llmImageQuality: llmImageQualitySchema.optional(),
        llmSpeechRecognitionModel: z.string().optional(),
        typeWriterSpeed: typeWriterSpeedInput.optional(),
      }),
    ).mutation(async ({ ctx, input }) => {
      if (
        input.aiTunnelDirect === undefined &&
        input.aiTunnelKey === undefined &&
        input.llmChatModel === undefined &&
        input.llmImageQuality === undefined &&
        input.llmImageModel === undefined &&
        input.llmSpeechRecognitionModel === undefined &&
        input.typeWriterSpeed === undefined
      ) {
        return load(ctx.userId);
      }

      const aiTunnelKey = input.aiTunnelKey === undefined ? undefined : input.aiTunnelKey.trim();

      await userSettings.updateLlmModels(ctx.userId, {
        ...input,
        ...(aiTunnelKey === undefined ? {} : { aiTunnelKey }),
      });

      return load(ctx.userId);
    }),
  };

  return { trpc };
};

export type UserSettings = ReturnType<typeof UserSettings>;
