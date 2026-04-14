/* eslint-disable functional/no-expression-statements */
import type { AiImageQuality } from "@snappy/ai";

import type { PrismaClient } from "./generated/client";

import { type BalanceHistoryMeta, insertBalanceHistory } from "./DbBalanceHistory";

export type UserBalanceCreditKind = `credit_payment`;

export type UserBalanceDebitKind = `debit_llm`;

type UserBalanceLedgerKind = UserBalanceCreditKind | UserBalanceDebitKind;

export const DbUser = (prisma: PrismaClient) => {
  const readBalance = async (userId: string) => {
    const row = await prisma.user.findUnique({ select: { balance: true }, where: { id: userId } });

    return row === null ? 0 : Number(row.balance);
  };

  const applyBalanceDelta = async (
    userId: string,
    delta: number,
    kind: UserBalanceLedgerKind,
    amountRubForHistory: number,
    meta?: BalanceHistoryMeta,
  ) =>
    prisma.$transaction(async tx => {
      await tx.user.update({ data: { balance: { increment: delta } }, where: { id: userId } });
      const row = await tx.user.findUniqueOrThrow({ select: { balance: true }, where: { id: userId } });
      await insertBalanceHistory(tx, { amountRub: amountRubForHistory, balanceAfter: row.balance, kind, meta, userId });
    });

  const creditBalance = async (
    userId: string,
    amountRub: number,
    kind: UserBalanceCreditKind,
    meta?: BalanceHistoryMeta,
  ) => applyBalanceDelta(userId, amountRub, kind, amountRub, meta);

  const debitBalance = async (
    userId: string,
    amountRub: number,
    kind: UserBalanceDebitKind,
    meta?: BalanceHistoryMeta,
  ) => applyBalanceDelta(userId, -amountRub, kind, amountRub, meta);

  const findSettingsByUserId = async (userId: string) =>
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

  return { creditBalance, debitBalance, findSettingsByUserId, readBalance, updateLlmModels };
};

export type DbUser = ReturnType<typeof DbUser>;

export type { BalanceHistoryMeta } from "./DbBalanceHistory";
