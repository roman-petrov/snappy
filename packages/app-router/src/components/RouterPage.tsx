/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { PageProps, RouterPageState } from "@snappy/router";

import { createElement, type ReactNode } from "react";

import { useRouter } from "../hooks/useRouter";

export type RouterPageProps = RouterPageState | { path: string };

export const RouterPage = (props: RouterPageProps) => {
  const { stateAt } = useRouter();
  const state = `path` in props ? stateAt(props.path) : props;

  return state === undefined ? undefined : createElement(state.page as (props: PageProps) => ReactNode, state.params);
};
