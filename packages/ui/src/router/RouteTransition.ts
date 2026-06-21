/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/max-params */
/* eslint-disable functional/no-expression-statements */
import type { TransitionFn } from "@snappy/router";

import { _ } from "@snappy/core";
import { flushSync } from "react-dom";

import type { RouteLayer, RouteLayerOf } from "./RouteOverlay";

const scopeAttribute = `data-route-scope`;

type Hosts = { content?: HTMLElement; onScope?: (scope: string | undefined) => void; overlay?: HTMLElement };

const refs = { current: {} as Hosts };
const scopeRef = { current: undefined as Hosts[`onScope`] };

const install = (next: Hosts) => {
  refs.current = { content: next.content, overlay: next.overlay };
  scopeRef.current = next.onScope;
};

const scope = (
  back: boolean,
  from: string,
  to: string,
  fromLayer: RouteLayer | undefined,
  toLayer: RouteLayer | undefined,
  parent: (pattern: string) => string,
): string => {
  if (fromLayer === `flip` || toLayer === `flip`) {
    return back ? `flip-back` : `flip-forward`;
  }

  if (fromLayer === `cover` && toLayer === `cover` && (back ? parent(from) === to : parent(to) === from)) {
    return back ? `overlay-pop` : `overlay-push`;
  }

  if (fromLayer === `cover` && toLayer === `cover`) {
    return back ? `overlay-back` : `overlay-forward`;
  }

  if (toLayer === `cover`) {
    return `overlay-forward`;
  }

  return `overlay-back`;
};

const layerOf =
  (resolve: RouteLayerOf): TransitionFn =>
  async ({ back, commit, from, parent, to }) => {
    const fromLayer = resolve(from);
    const toLayer = resolve(to);

    if (fromLayer === undefined && toLayer === undefined && from !== to) {
      commit(`replace`);

      return;
    }

    const animation = scope(back, from, to, fromLayer, toLayer, parent);
    const host = (animation.startsWith(`flip-`) ? refs.current.content : refs.current.overlay) ?? refs.current.content;
    const push = () => commit(`push`);

    if (host === undefined) {
      push();

      return;
    }

    const scoped = (host as HTMLElement & { startViewTransition?: (update: () => void) => ViewTransition })
      .startViewTransition;

    if (!_.isFunction(scoped) || scoped === document.startViewTransition) {
      push();

      return;
    }

    host.setAttribute(scopeAttribute, animation);

    await scoped
      .call(host, () => {
        flushSync(() => {
          scopeRef.current?.(animation);
          push();
        });
      })
      .finished.finally(() => {
        host.removeAttribute(scopeAttribute);
        scopeRef.current?.(undefined);
      });
  };

export const RouteTransition = { install, layerOf };
