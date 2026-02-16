import { useNavigate } from "react-router-dom";

import { $loggedIn } from "../Store";

export type RunAfterAuthFn = (submit: () => Promise<{ status: string }>) => void;

export const useRunAfterAuth = (
  wrapSubmit: (fn: () => Promise<void>) => Promise<void> | void,
  setError: (message: string) => void,
  tFn: (key: string) => string,
  errorsKeyPrefix: string,
): RunAfterAuthFn => {
  const navigate = useNavigate();

  return (submit: () => Promise<{ status: string }>) => {
    void wrapSubmit(async () => {
      const result = await submit();
      if (result.status !== `ok`) {
        setError(tFn(`${errorsKeyPrefix}.errors.${result.status}`));

        return;
      }
      $loggedIn.set(true);
      void navigate(`/`, { replace: true, viewTransition: true });
    });
  };
};
