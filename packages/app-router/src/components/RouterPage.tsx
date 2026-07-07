/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { PageProps, RouterPageState } from "@snappy/router";

import { useRequiredContext } from "@snappy/hooks";
import { createElement, type ReactNode, useMemo } from "react";

import { RouterContext } from "../core";

export type RouterPageProps = RouterPageState | { path: string };

const render = (state: RouterPageState | undefined) =>
  state === undefined ? undefined : createElement(state.page as (props: PageProps) => ReactNode, state.params);

export const RouterPage = (props: RouterPageProps) => {
  const { runtime } = useRequiredContext(RouterContext, `RouterPage`, `RouterContext`);
  const path = `path` in props ? props.path : undefined;
  const lane = useMemo(() => (path === undefined ? undefined : render(runtime.stateAt(path))), [path, runtime]);

  return `path` in props ? lane : render(props);
};
