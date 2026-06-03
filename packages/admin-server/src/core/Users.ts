import type { Db } from "@snappy/db";

import { z } from "zod";

import { AdminTrpcAuth } from "./AdminTrpc";

export type UsersConfig = { db: ReturnType<typeof Db> };

export const Users = ({ db }: UsersConfig) => {
  const idInput = z.object({ id: z.string().min(1) });
  const maxPageSize = 100;

  const list = AdminTrpcAuth.input(
    z.object({ page: z.number().int().min(1), pageSize: z.number().int().min(1).max(maxPageSize) }),
  ).query(async ({ input }) => db.users.list(input));

  const read = AdminTrpcAuth.input(idInput).query(async ({ input }) => db.users.read(input.id));

  const update = AdminTrpcAuth.input(idInput.extend({ balanceRub: z.number().min(0) })).mutation(async ({ input }) =>
    db.user(input.id).balance.set(input.balanceRub),
  );

  const remove = AdminTrpcAuth.input(idInput).mutation(async ({ input }) => db.users.remove(input.id));
  const trpc = { delete: remove, list, read, update };

  return { trpc };
};

export type Users = ReturnType<typeof Users>;
