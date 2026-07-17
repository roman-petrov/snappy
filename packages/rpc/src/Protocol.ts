/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/try-complexity */
import { _, Json } from "@snappy/core";

export type RpcErrorCode = `BAD_REQUEST` | `INTERNAL` | `UNAUTHORIZED`;

export type RpcEvent = { data: unknown; path: string; seq: number; type: `event` };

export type RpcRequest = { id: string; input?: unknown; path: string };

export type RpcResponse =
  { data: unknown; id: string; ok: true } | { error: { code: RpcErrorCode; message?: string }; id: string; ok: false };

export type RpcWire = RpcEvent | RpcRequest | RpcResponse;

const record = (value: unknown): value is Record<string, unknown> => value instanceof Object && !_.isArray(value);

const request = (value: unknown): RpcRequest | undefined =>
  !record(value) || !_.isString(value[`id`]) || !_.isString(value[`path`])
    ? undefined
    : { id: value[`id`], input: value[`input`], path: value[`path`] };

const response = (value: unknown): RpcResponse | undefined => {
  if (!record(value) || !_.isString(value[`id`]) || !(`ok` in value)) {
    return undefined;
  }
  if (value[`ok`] === true) {
    return { data: value[`data`], id: value[`id`], ok: true };
  }
  if (value[`ok`] !== false || !record(value[`error`]) || !_.isString(value[`error`][`code`])) {
    return undefined;
  }
  const { code, message } = value[`error`];
  const errorCode = ([`BAD_REQUEST`, `INTERNAL`, `UNAUTHORIZED`] as const).find(item => item === code);

  return errorCode === undefined
    ? undefined
    : {
        error: { code: errorCode, message: _.isString(message) ? message : undefined },
        id: value[`id`],
        ok: false as const,
      };
};

const event = (value: unknown): RpcEvent | undefined =>
  !record(value) || value[`type`] !== `event` || !_.isString(value[`path`]) || !_.isNumber(value[`seq`])
    ? undefined
    : { data: value[`data`], path: value[`path`], seq: value[`seq`], type: `event` };

const parse = (text: string): RpcWire | undefined => {
  try {
    const value: unknown = Json.parse(text);

    return request(value) ?? response(value) ?? event(value);
  } catch {
    return undefined;
  }
};

const stringify = (message: RpcWire) => Json.stringify(message);

export const Protocol = { parse, stringify };
