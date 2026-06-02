import type { PrismaClient } from "./generated/client";

export type DbUsersListInput = { page: number; pageSize: number };

export const DbUsers = (prisma: PrismaClient) => {
  const list = async ({ page, pageSize }: DbUsersListInput) => {
    const skip = (page - 1) * pageSize;

    const [rows, total] = await Promise.all([
      prisma.user.findMany({ include: { userBalance: true }, orderBy: { createdAt: `desc` }, skip, take: pageSize }),
      prisma.user.count(),
    ]);

    const items = rows.map(row => ({
      balanceRub: row.userBalance === null ? 0 : Number(row.userBalance.amount),
      createdAt: row.createdAt.getTime(),
      email: row.email,
      emailVerified: row.emailVerified,
      id: row.id,
    }));

    return { items, page, total };
  };

  const remove = async (id: string) => prisma.user.delete({ where: { id } });

  return { list, remove };
};

export type DbUsers = ReturnType<typeof DbUsers>;
