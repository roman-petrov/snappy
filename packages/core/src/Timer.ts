/* eslint-disable functional/no-expression-statements */
import type { Action } from "./Types";

const interval = (fn: Action, ms = 0) => {
  const id = setInterval(fn, ms);

  return () => clearInterval(id);
};

const timeout = (fn: Action, ms = 0) => {
  const id = setTimeout(fn, ms);

  return () => clearTimeout(id);
};

const sleep = async (ms = 0) =>
  new Promise<void>(resolve => {
    timeout(resolve, ms);
  });

export const Timer = { interval, sleep, timeout };
