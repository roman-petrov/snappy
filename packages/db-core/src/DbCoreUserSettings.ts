/* eslint-disable functional/no-expression-statements */
import { AiConstants, type AiImageQuality, AiModels } from "@snappy/ai";
import { type TypeWriterSpeed, TypeWriterSpeeds } from "@snappy/domain";

import type { UserSettings } from "./generated/client";

import { DbCoreConvert } from "./DbCoreConvert";
import { DbCoreLive } from "./DbCoreLive";

export type DbCoreSettings = {
  aiTunnelDirect: boolean;
  aiTunnelKey: string;
  llmChatModel: string;
  llmImageModel: string;
  llmImageQuality: AiImageQuality;
  llmSpeechRecognitionModel: string;
  llmVisionModel: string;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const DbCoreUserSettings = DbCoreLive<DbCoreSettings>()(({ emit, prisma, userId }) => {
  const imageQuality = (value: string | undefined) =>
    AiConstants.imageQuality.find(quality => quality === value) ?? AiConstants.defaults.imageQuality;

  const typeWriterSpeed = (value: string | undefined) => {
    if (value === undefined || value === ``) {
      return undefined;
    }

    const normalized = value === `normal` ? `medium` : value;

    return TypeWriterSpeeds.find(speed => speed === normalized);
  };

  const or = (value: null | string | undefined, fallback: string) => DbCoreConvert.optional(value) ?? fallback;

  const fromRow = (row: null | UserSettings): DbCoreSettings => ({
    aiTunnelDirect: row?.aiTunnelDirect ?? false,
    aiTunnelKey: row?.aiTunnelKey ?? ``,
    llmChatModel: or(row?.llmChatModel, AiModels.fallback.chat.name),
    llmImageModel: or(row?.llmImageModel, AiModels.fallback.image.name),
    llmImageQuality: imageQuality(DbCoreConvert.optional(row?.llmImageQuality)),
    llmSpeechRecognitionModel: or(row?.llmSpeechRecognitionModel, AiModels.fallback.speechRecognition.name),
    llmVisionModel: or(row?.llmVisionModel, AiModels.fallback.vision.name),
    typeWriterSpeed: typeWriterSpeed(DbCoreConvert.optional(row?.typeWriterSpeed)),
  });

  const read = async () => fromRow(await prisma.userSettings.findUnique({ where: { userId } }));

  const update = async (snapshot: DbCoreSettings) => {
    const fields = { ...snapshot, typeWriterSpeed: snapshot.typeWriterSpeed ?? `` };
    await prisma.userSettings.upsert({ create: { userId, ...fields }, update: fields, where: { userId } });
    emit(snapshot);

    return snapshot;
  };

  return { read, update };
});

export type DbCoreUserSettings = ReturnType<typeof DbCoreUserSettings>;
