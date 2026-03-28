import type { Action } from "./Types";

const interval = (fn: Action, ms = 0) => {
  const id = setInterval(fn, ms);

  return () => clearInterval(id);
};

const timeout = (fn: Action, ms = 0) => {
  const id = setTimeout(fn, ms);

  return () => clearTimeout(id);
};

export const Timer = { interval, timeout };
