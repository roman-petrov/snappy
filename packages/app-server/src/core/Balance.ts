/* eslint-disable functional/no-expression-statements */
import type { DbBalanceHistoryMeta, DbUser } from "@snappy/db";

import { Config } from "@snappy/config";

import { AppTrpcAuth } from "./AppTrpc";

const read = async (user: DbUser) => user.balance.read();
const isLlmBlocked = async (user: DbUser) => (await read(user)) <= 0;

const creditFromTopUp = async (user: DbUser, amountRub: number, meta?: DbBalanceHistoryMeta) =>
  user.balance.credit(amountRub, meta);

const creditFromSignUp = async (user: DbUser) =>
  user.balance.credit(Config.balance.signUpBonusRub, { source: `signUp` });

const debitForLlm = async (user: DbUser, rub: number, meta: { call: string; model: string }) => {
  await user.balance.debit(rub, { ...meta, chargedRub: rub });
};

const trpc = AppTrpcAuth.query(async ({ ctx }) => read(ctx.dbUser));

export const Balance = { creditFromSignUp, creditFromTopUp, debitForLlm, isLlmBlocked, read, trpc };

export type Balance = typeof Balance;
