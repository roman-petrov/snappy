import type { TrpcOutputs } from "@snappy/admin-server-api";

import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { trpc } from "../../core";

export const useUserListState = () => {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TrpcOutputs[`users`][`list`] | undefined>(undefined);

  useAsyncEffect(async () => setData(await trpc.users.list.query({ page, pageSize })), [page]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return { items, page, pageSize, setPage, total };
};
