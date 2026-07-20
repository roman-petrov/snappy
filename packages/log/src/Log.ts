import type { Logger } from "pino";

import { _ } from "@snappy/core";

import { FileLogger } from "./FileLogger";

export type LogFields = Record<string, unknown>;

const domains = [`ai`, `auth`, `payment`] as const;
const methods = [`error`, `info`, `warn`] as const;

export type Log = Record<Domain, LogChannel>;

type Domain = (typeof domains)[number];

type LogChannel = Record<Method, (event: string, fields?: LogFields) => void>;

type Method = (typeof methods)[number];

const channel = (write: (method: Method) => (event: string, fields?: LogFields) => void) =>
  _.fromEntries(methods.map(method => [method, write(method)])) as LogChannel;

const fromLogger = (logger: Logger) =>
  channel(
    method =>
      (event, fields = {}) =>
        logger[method](fields, event),
  );

const bind = (base: LogChannel, baseFields: LogFields) =>
  channel(
    method =>
      (event, fields = {}) =>
        base[method](event, { ...baseFields, ...fields }),
  );

const root = _.fromEntries(domains.map(name => [name, fromLogger(FileLogger(name))]));

const withFields = (baseFields: LogFields = {}): Log =>
  _.keys(baseFields).length === 0 ? root : _.mapEntries(root, (name, base) => [name, bind(base, baseFields)]);

export const Log = { ...root, withFields };
