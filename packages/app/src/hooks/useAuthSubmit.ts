import { useGo } from "@snappy/ui";

import { Routes } from "../Routes";
import { $loggedIn } from "../Store";
import { useAsyncSubmit } from "./useAsyncSubmit";

export const useAuthSubmit = (errorsKeyPrefix: string) => {
  const go = useGo();
  const { error, loading, setError, wrapSubmit } = useAsyncSubmit();

  const onSubmit = (submit: () => Promise<{ status: string }>) => {
    void wrapSubmit(async () => {
      const result = await submit();
      if (result.status !== `ok`) {
        setError({ key: `${errorsKeyPrefix}.errors.${result.status}` });

        return;
      }
      $loggedIn.set(true);
      void go(Routes.home, { replace: true });
    });
  };

  return { error, loading, onSubmit, setError };
};
