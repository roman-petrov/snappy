import { useNavigate } from "react-router-dom";

import { $loggedIn } from "../Store";

export type RunAfterAuthFn = (submit: () => Promise<unknown>) => void;

export const useRunAfterAuth = (wrapSubmit: (fn: () => Promise<void>) => Promise<void> | void): RunAfterAuthFn => {
  const navigate = useNavigate();

  return (submit: () => Promise<unknown>) => {
    void wrapSubmit(async () => {
      await submit();
      $loggedIn.set(true);
      void navigate(`/`, { replace: true, viewTransition: true });
    });
  };
};
