import { _ } from "@snappy/core";
import { useCallback } from "react";
import {
  type NavigateFunction,
  type NavigateOptions,
  type To,
  useNavigate as useRouterNavigate,
} from "react-router-dom";

export type Go = NavigateFunction;

export const useGo = (): NavigateFunction => {
  const routerNavigate = useRouterNavigate();

  return useCallback(
    async (to: number | To, { viewTransition = true, ...options }: NavigateOptions = {}) => {
      await (_.isNumber(to) ? routerNavigate(to) : routerNavigate(to, { ...options, viewTransition }));
    },
    [routerNavigate],
  );
};
