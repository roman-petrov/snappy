/* eslint-disable functional/no-expression-statements */
import { useEffect } from "react";

import { useRouterGo } from "../hooks";

export type RedirectProps = { to: string };

export const Redirect = ({ to }: RedirectProps) => {
  const go = useRouterGo();

  useEffect(() => {
    void go(to, { replace: true });
  }, [go, to]);

  return undefined;
};
