import type { DbUsers } from "@snappy/db";

import { z } from "zod";

import { AdminTrpcAuth } from "./AdminTrpc";

export type UsersConfig = { dbUsers: DbUsers; pageSize: number };

export const Users = ({ dbUsers, pageSize }: UsersConfig) => {
  const list = AdminTrpcAuth.input(z.object({ page: z.number().int().min(1) })).query(async ({ input }) => {
    const result = await dbUsers.list({ page: input.page, pageSize });

    return { ...result, pageCount: Math.max(1, Math.ceil(result.total / pageSize)) };
  });

  const deleteUser = AdminTrpcAuth.input(z.object({ id: z.string().min(1) })).mutation(async ({ input }) =>
    dbUsers.remove(input.id),
  );

  const trpc = { delete: deleteUser, list };

  return { trpc };
};

export type Users = ReturnType<typeof Users>;
