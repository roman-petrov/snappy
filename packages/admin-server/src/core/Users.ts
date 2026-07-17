/* eslint-disable functional/no-expression-statements */
import type { Db } from "@snappy/db";

import { z } from "zod";

import { RpcScope } from "./RpcContract";

export type UsersConfig = { db: Db; room: string };

export const Users = ({ db, room }: UsersConfig) => {
  const { doc, mut, query } = RpcScope;
  const idInput = z.object({ id: z.string().min(1) });
  const maxPageSize = 100;
  const defaultPageSize = 20;

  const list = query(
    z.object({
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(maxPageSize).default(defaultPageSize),
    }),
    async ({ input }) => db.users.list(input),
  );

  const read = query(idInput, async ({ input }) => db.users.read(input.id));

  const update = doc(db.balance, { room }, idInput.extend({ balance: z.number().min(0) }), async ({ input }) =>
    db.user(input.id).balance.set(input.balance),
  );

  const remove = mut(idInput, async ({ input }) => {
    await db.users.remove(input.id);

    return input;
  });

  const rpc = { list, read, remove, update };

  return { rpc };
};

export type Users = ReturnType<typeof Users>;
