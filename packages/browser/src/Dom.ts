/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
import type { DomSubscribe } from "./DomSubscribeTypes";

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

export const Dom = { subscribe, subscribeOnce };
