import { i } from "@snappy/intl";
import { useAsyncEffectOnce } from "@snappy/ui";
import { useState } from "react";

import { trpc } from "../core";

export const useBalanceTapState = () => {
  const [label, setLabel] = useState(`…`);

  useAsyncEffectOnce(async () => setLabel(i.price(await trpc.user.balance.query())));

  return { label };
};
