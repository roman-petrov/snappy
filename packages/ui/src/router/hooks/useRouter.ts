import { useStoreValue } from "@snappy/store";

import { useRequiredContext } from "../../hooks/useRequiredContext";
import { RouterContext } from "../RouterContext";

export const useRouter = () => {
  const { current, parent, pattern, stateAt } = useRequiredContext(RouterContext, `useRouter`, `RouterContext`);
  const { $context, $page } = current();

  return { ...useStoreValue($context), $page, parent, pattern, stateAt };
};
