import type { PrismaClient } from "./generated/client";

import { DbCoreConvert } from "./DbCoreConvert";

type ListInput = { page: number; pageSize: number };

export const DbCoreUsers = (prisma: PrismaClient) => {
  const list = async ({ page, pageSize }: ListInput) => {
    const skip = (page - 1) * pageSize;

    const [rows, total] = await Promise.all([
      prisma.user.findMany({ include: { userBalance: true }, orderBy: { createdAt: `desc` }, skip, take: pageSize }),
      prisma.user.count(),
    ]);

    const items = rows.map(({ createdAt, userBalance, ...user }) => ({
      ...user,
      balanceRub: DbCoreConvert.amount(userBalance?.amount),
      createdAt: DbCoreConvert.time(createdAt),
    }));

    return { items, page, total };
  };

  const read = async (id: string) => {
    const row = await prisma.user.findUnique({ include: { userBalance: true }, where: { id } });

    if (row === null) {
      return undefined;
    }

    const { userBalance, ...user } = row;

    return { ...user, balanceRub: DbCoreConvert.amount(userBalance?.amount) };
  };

  const remove = async (id: string) => prisma.user.delete({ where: { id } });

  return { list, read, remove };
};

export type DbCoreUsers = ReturnType<typeof DbCoreUsers>;
