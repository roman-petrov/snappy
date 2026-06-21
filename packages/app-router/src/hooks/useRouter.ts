import { useRequiredContext } from "@snappy/hooks";
import { useStoreValue } from "@snappy/store";

import { RouterContext } from "../core";

export const useRouter = () => {
  const { runtime } = useRequiredContext(RouterContext, `useRouter`, `RouterContext`);
  const { current, parent, pattern, stateAt } = runtime;
  const { $context, $page } = current();

  return { ...useStoreValue($context), $page, parent, pattern, stateAt };
};
