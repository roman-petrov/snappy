import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { Confirm, t, trpc } from "../core";

export const useUsersState = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Awaited<ReturnType<typeof trpc.users.list.query>> | undefined>(undefined);

  useAsyncEffect(async () => setData(await trpc.users.list.query({ page })), [page]);

  const remove = async (id: string) => {
    if (!Confirm(t(`users.deleteConfirm`))) {
      return;
    }

    await trpc.users.delete.mutate({ id });
    setData(await trpc.users.list.query({ page }));
  };

  const items = data?.items ?? [];
  const pageCount = data?.pageCount ?? 1;
  const next = () => setPage(page + 1);
  const previous = () => setPage(page - 1);
  const nextDisabled = page >= pageCount;
  const previousDisabled = page <= 1;
  const columnKeys = [`email`, `balance`, `createdAt`, `emailVerified`, `actions`] as const;

  return { columnKeys, items, next, nextDisabled, page, pageCount, previous, previousDisabled, remove };
};
