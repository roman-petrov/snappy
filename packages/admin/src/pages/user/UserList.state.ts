import { useState } from "react";

import { r } from "../../data";

export const useUserListState = () => {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const { items, total = 0 } = r.users({ page, pageSize });

  return { items, page, pageSize, setPage, total };
};
