/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { DbUserSettings } from "@snappy/db";

import { type Ai, AiConstants, type AiImageQuality } from "@snappy/ai";
import { z } from "zod";

import { TrpcAuth } from "./Trpc";

export type UserSettingsConfig = { ai: Ai; userSettings: DbUserSettings };

export const UserSettings = ({ ai, userSettings }: UserSettingsConfig) => {
  const load = async (userId: string) => {
    const row = await userSettings.findByUserId(userId);

    return {
      aiTunnelDirect: row?.aiTunnelDirect ?? false,
      aiTunnelKey: row?.aiTunnelKey ?? ``,
      llmChatModel: row?.llmChatModel ?? ai.defaults.models.chat,
      llmImageModel: row?.llmImageModel ?? ai.defaults.models.image,
      llmImageQuality: (row?.llmImageQuality as AiImageQuality) ?? ai.defaults.imageQuality,
      llmSpeechRecognitionModel: row?.llmSpeechRecognitionModel ?? ai.defaults.models.speechRecognition,
    };
  };

  const trpc = {
    get: TrpcAuth.query(async ({ ctx }) => load(ctx.userId)),
    set: TrpcAuth.input(
      z.object({
        aiTunnelDirect: z.boolean().optional(),
        aiTunnelKey: z.string().optional(),
        llmChatModel: z.string().optional(),
        llmImageModel: z.string().optional(),
        llmImageQuality: z.enum(AiConstants.imageQuality).optional(),
        llmSpeechRecognitionModel: z.string().optional(),
      }),
    ).mutation(async ({ ctx, input }) => {
      if (
        input.aiTunnelDirect === undefined &&
        input.aiTunnelKey === undefined &&
        input.llmChatModel === undefined &&
        input.llmImageQuality === undefined &&
        input.llmImageModel === undefined &&
        input.llmSpeechRecognitionModel === undefined
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
