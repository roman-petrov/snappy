/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/try-complexity */
import { _, Json } from "@snappy/core";

export type AuthMessage = { key: string; type: `auth` };

export type CloseMessage = { id: number; type: `close` };

export type ControlMessage = AuthMessage | CloseMessage | OpenMessage | ReadyMessage;

export type OpenMessage = { id: number; port: number; type: `open` };

export type ReadyMessage = { port: number; type: `ready` };

export type TunnelRawSocket = {
  close: () => void;
  on: {
    (event: `close` | `error` | `open`, listener: () => void): void;
    (event: `message`, listener: (raw: ArrayBuffer | Buffer | Buffer[] | string, isBinary: boolean) => void): void;
  };
  send: (data: Buffer | string) => void;
};

export type TunnelSocketHandlers = {
  onClose?: () => void;
  onControl?: (message: ControlMessage) => void;
  onData?: (id: number, chunk: Buffer) => void;
  onError?: () => void;
  onOpen?: () => void;
};

export const TunnelSocket = (
  socket: TunnelRawSocket,
  { onClose, onControl, onData, onError, onOpen }: TunnelSocketHandlers = {},
) => {
  const idSize = 4;

  const bytes = (raw: ArrayBuffer | Buffer | Buffer[] | string) =>
    Buffer.isBuffer(raw)
      ? raw
      : Array.isArray(raw)
        ? Buffer.concat(raw)
        : _.isString(raw)
          ? Buffer.from(raw)
          : Buffer.from(new Uint8Array(raw));

  const isControl = (value: unknown): value is ControlMessage => {
    if (!_.isObject(value) || !(`type` in value) || !_.isString(value.type)) {
      return false;
    }
    switch (value.type) {
      case `auth`: {
        return `key` in value && _.isString(value.key);
      }
      case `close`: {
        return `id` in value && _.isNumber(value.id);
      }
      case `open`: {
        return `id` in value && _.isNumber(value.id) && `port` in value && _.isNumber(value.port);
      }
      case `ready`: {
        return `port` in value && _.isNumber(value.port);
      }
      default: {
        return false;
      }
    }
  };

  const parseControl = (text: string) => {
    try {
      const value: unknown = Json.parse(text);

      return isControl(value) ? value : undefined;
    } catch {
      return undefined;
    }
  };

  const parseData = (buffer: Buffer) =>
    buffer.length < idSize ? undefined : { chunk: buffer.subarray(idSize), id: buffer.readUInt32BE(0) };

  socket.on(`open`, () => onOpen?.());
  socket.on(`close`, () => onClose?.());
  socket.on(`error`, () => onError?.());
  socket.on(`message`, (raw, isBinary) => {
    if (!isBinary) {
      const text = _.isString(raw) ? raw : bytes(raw).toString(`utf8`);
      const message = parseControl(text);
      if (message !== undefined) {
        onControl?.(message);
      }

      return;
    }
    const parsed = parseData(bytes(raw));
    if (parsed !== undefined) {
      onData?.(parsed.id, parsed.chunk);
    }
  });

  const sendControl = (message: ControlMessage) => socket.send(Json.stringify(message));

  const sendData = (id: number, chunk: Buffer) => {
    const header = Buffer.alloc(idSize);
    header.writeUInt32BE(id);
    socket.send(Buffer.concat([header, chunk]));
  };

  return { close: () => socket.close(), sendControl, sendData };
};

export type TunnelSocket = ReturnType<typeof TunnelSocket>;
