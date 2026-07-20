import type { Logger } from "pino";

import { FileLogger } from "./FileLogger";

type LogFields = Record<string, unknown>;

const channel = (logger: Logger) => {
  const write =
    (method: `error` | `info` | `warn`) =>
    (event: string, fields: LogFields = {}) =>
      logger[method](fields, event);

  const error = write(`error`);
  const info = write(`info`);
  const warn = write(`warn`);

  return { error, info, warn };
};

const ai = channel(FileLogger(`ai`));
const auth = channel(FileLogger(`auth`));
const payment = channel(FileLogger(`payment`));

export const Log = { ai, auth, payment };
