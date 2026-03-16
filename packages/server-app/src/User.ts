import type { Db } from "@snappy/db";

export const User = ({ user }: { user: Db[`user`] }) => {
  const ensureUserByTelegramId = async (telegramId: number, telegramUsername?: string) =>
    user.upsertByTelegramId(telegramId, telegramUsername);

  return { ensureUserByTelegramId };
};

export type User = ReturnType<typeof User>;
