/* eslint-disable functional/no-loop-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
import { _, type Action } from "@snappy/core";

import type { DomSubscribe } from "./DomSubscribeTypes";

export type DomSize = { height: number; width: number };

const subscribe: DomSubscribe = (element, type, listener, options) => {
  element?.addEventListener(type, listener as never, options);

  return () => {
    element?.removeEventListener(type, listener as never, options);
  };
};

const subscribeOnce: DomSubscribe = (element, type, listener, options) => {
  const unsubscribe = subscribe(
    element,
    type,
    event => {
      unsubscribe();
      listener(event);
    },
    options,
  );

  return unsubscribe;
};

const size = (element: HTMLElement): DomSize => {
  const { height, width } = element.getBoundingClientRect();

  return { height, width };
};

const watchSize = (element: HTMLElement | null | undefined, onSize: (size: DomSize) => void): Action => {
  if (element === null || element === undefined) {
    return _.noop;
  }

  const sync = () => onSize(size(element));

  sync();
  const observer = new ResizeObserver(sync);
  observer.observe(element);

  return () => {
    observer.disconnect();
  };
};

const tag = (value?: string) => (value === undefined ? {} : { tag: value });

const each = (elements: readonly HTMLElement[], apply: (element: HTMLElement) => void) => {
  for (const element of elements) {
    apply(element);
  }
};

export const Dom = { each, size, subscribe, subscribeOnce, tag, watchSize };
