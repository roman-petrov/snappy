/* @vitest-environment node */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable no-void */
import { HttpConstants, Json } from "@snappy/core";
import { describe, expect, it, vi } from "vitest";

import { type TunnelRawSocket, TunnelSocket } from "./TunnelSocket";

const rawSocket = () => {
  const listeners = new Map<string, ((...args: never[]) => void)[]>();
  const sent: (Buffer | string)[] = [];

  const raw: TunnelRawSocket & { emit: (event: string, ...args: unknown[]) => void; sent: (Buffer | string)[] } = {
    close: vi.fn(),
    emit: (event, ...args) => {
      for (const listener of listeners.get(event) ?? []) {
        (listener as (...args: unknown[]) => void)(...args);
      }
    },
    on: (event: string, listener: (...args: never[]) => void) =>
      void listeners.set(event, [...(listeners.get(event) ?? []), listener]),
    send: (data: Buffer | string) => void sent.push(data),
    sent,
  };

  return raw;
};

describe(`sendControl`, () => {
  it(`sends auth as json text`, () => {
    const raw = rawSocket();
    const tunnel = TunnelSocket(raw);
    tunnel.sendControl({ key: `secret`, type: `auth` });
    const [frame] = raw.sent;

    expect(Json.parse(String(frame))).toStrictEqual({ key: `secret`, type: `auth` });
  });
});

describe(`sendData`, () => {
  it(`frames stream id and payload`, () => {
    const raw = rawSocket();
    const tunnel = TunnelSocket(raw);
    tunnel.sendData(7, Buffer.from(`hi`));
    const [frame] = raw.sent;

    expect(Buffer.isBuffer(frame)).toBe(true);
    expect(Buffer.isBuffer(frame) && frame.readUInt32BE(0)).toBe(7);
    expect(Buffer.isBuffer(frame) && frame.subarray(4).toString()).toBe(`hi`);
  });
});

describe(`close`, () => {
  it(`closes the raw socket`, () => {
    const raw = rawSocket();
    TunnelSocket(raw).close();

    expect(raw.close).toHaveBeenCalledTimes(1);
  });
});

describe(`onOpen`, () => {
  it(`invokes handler`, () => {
    const raw = rawSocket();
    const onOpen = vi.fn();
    TunnelSocket(raw, { onOpen });
    raw.emit(`open`);

    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});

describe(`onClose`, () => {
  it(`invokes handler`, () => {
    const raw = rawSocket();
    const onClose = vi.fn();
    TunnelSocket(raw, { onClose });
    raw.emit(`close`);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe(`onError`, () => {
  it(`invokes handler`, () => {
    const raw = rawSocket();
    const onError = vi.fn();
    TunnelSocket(raw, { onError });
    raw.emit(`error`);

    expect(onError).toHaveBeenCalledTimes(1);
  });
});

describe(`onControl`, () => {
  it(`delivers parsed control messages`, () => {
    const raw = rawSocket();
    const onControl = vi.fn();
    TunnelSocket(raw, { onControl });
    raw.emit(`message`, Json.stringify({ id: 1, port: HttpConstants.httpsPort, type: `open` }), false);

    expect(onControl).toHaveBeenCalledWith({ id: 1, port: HttpConstants.httpsPort, type: `open` });
  });

  it(`ignores invalid json`, () => {
    const raw = rawSocket();
    const onControl = vi.fn();
    TunnelSocket(raw, { onControl });
    raw.emit(`message`, `{`, false);

    expect(onControl).not.toHaveBeenCalled();
  });

  it(`ignores control messages with invalid shape`, () => {
    const raw = rawSocket();
    const onControl = vi.fn();
    TunnelSocket(raw, { onControl });
    raw.emit(`message`, Json.stringify({ type: `auth` }), false);
    raw.emit(`message`, Json.stringify({ id: 1, type: `open` }), false);

    expect(onControl).not.toHaveBeenCalled();
  });

  it(`accepts control payload from a buffer`, () => {
    const raw = rawSocket();
    const onControl = vi.fn();
    TunnelSocket(raw, { onControl });
    raw.emit(`message`, Buffer.from(Json.stringify({ port: 1, type: `ready` })), false);

    expect(onControl).toHaveBeenCalledWith({ port: 1, type: `ready` });
  });
});

describe(`onData`, () => {
  it(`delivers framed binary payloads`, () => {
    const raw = rawSocket();
    const onData = vi.fn();
    TunnelSocket(raw, { onData });
    const header = Buffer.alloc(4);
    header.writeUInt32BE(7);
    raw.emit(`message`, Buffer.concat([header, Buffer.from(`hi`)]), true);

    expect(onData).toHaveBeenCalledWith(7, Buffer.from(`hi`));
  });

  it(`ignores frames shorter than the stream id`, () => {
    const raw = rawSocket();
    const onData = vi.fn();
    TunnelSocket(raw, { onData });
    raw.emit(`message`, Buffer.alloc(3), true);

    expect(onData).not.toHaveBeenCalled();
  });
});
