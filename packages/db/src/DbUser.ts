/* eslint-disable unicorn/no-null */
import type { PrismaClient } from "./generated/client";

export type DbUser = {
  createdAt: number;
  email: string | undefined;
  id: number;
  passwordHash: string | undefined;
  resetToken: string | undefined;
  resetTokenExpires: number | undefined;
  telegramId: number | undefined;
  telegramUsername: string | undefined;
};

const parse = (row: {
  createdAt: Date;
  email: null | string;
  id: number;
  passwordHash: null | string;
  resetToken: null | string;
  resetTokenExpires: Date | null;
  telegramId: null | number;
  telegramUsername: null | string;
}): DbUser => ({
  createdAt: row.createdAt.getTime(),
  email: row.email ?? undefined,
  id: row.id,
  passwordHash: row.passwordHash ?? undefined,
  resetToken: row.resetToken ?? undefined,
  resetTokenExpires: row.resetTokenExpires === null ? undefined : row.resetTokenExpires.getTime(),
  telegramId: row.telegramId ?? undefined,
  telegramUsername: row.telegramUsername ?? undefined,
});

export const DbUser = (prisma: PrismaClient) => {
  const findByEmail = async (email: string) => {
    const row = await prisma.user.findUnique({ where: { email } });

    return row === null ? undefined : parse(row);
  };

  const createWithEmailPassword = async (email: string, passwordHash: string) =>
    parse(await prisma.user.create({ data: { email, passwordHash } }));

  const setResetToken = async (id: number, resetToken: string, resetTokenExpires: number) =>
    prisma.user.update({ data: { resetToken, resetTokenExpires: new Date(resetTokenExpires) }, where: { id } });

  const findByResetToken = async (token: string, expiresAfter: number) => {
    const row = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpires: { gt: new Date(expiresAfter) } },
    });

    return row === null ? undefined : parse(row);
  };

  const clearResetAndSetPassword = async (id: number, passwordHash: string) =>
    prisma.user.update({ data: { passwordHash, resetToken: null, resetTokenExpires: null }, where: { id } });

  const upsertByTelegramId = async (telegramId: number, telegramUsername?: string) =>
    parse(
      await prisma.user.upsert({
        create: { telegramId, telegramUsername: telegramUsername ?? undefined },
        update: telegramUsername === undefined ? {} : { telegramUsername },
        where: { telegramId },
      }),
    );

  return {
    clearResetAndSetPassword,
    createWithEmailPassword,
    findByEmail,
    findByResetToken,
    setResetToken,
    upsertByTelegramId,
  };
};
