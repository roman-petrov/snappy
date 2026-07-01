/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-void */
import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { $data } from "../../data";

export const useUserListState = () => {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const { load, users } = $data.users();

  useAsyncEffect(async () => void load({ page, pageSize }), [load, page]);

  const items = users?.items ?? [];
  const total = users?.total ?? 0;

  return { items, page, pageSize, setPage, total };
};
