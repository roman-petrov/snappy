/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";

import { Dom } from "./Dom";

const matches = (query: string) => (typeof window === `undefined` ? false : window.matchMedia(query).matches);

const subscribe = (query: string, onMatch: (matches: boolean) => void) => {
  if (typeof window === `undefined`) {
    return _.noop;
  }
  const mq = window.matchMedia(query);
  onMatch(mq.matches);

  return Dom.subscribe(mq, `change`, event => onMatch(event.matches));
};

export const MediaQuery = { matches, subscribe };
