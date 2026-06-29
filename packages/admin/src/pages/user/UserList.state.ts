import type { TrpcOutputs } from "@snappy/admin-server-api";

import { useRouterPath } from "@snappy/app-router";
import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { trpc } from "../../core";
import { Routes } from "../../Routes";

export const useUserListState = () => {
  const path = useRouterPath();
  const active = path === Routes.user.list;
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<TrpcOutputs[`users`][`list`] | undefined>(undefined);

  useAsyncEffect(async () => {
    if (!active) {
      return;
    }
    setData(await trpc.users.list.query({ page, pageSize }));
  }, [active, page]);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return { items, page, pageSize, setPage, total };
};
