/* @vitest-environment node */
import { describe, expect, it, vi } from "vitest";

import type { SocketRaw } from "../socket";

import { Protocol } from "../Protocol";
import { Hub } from "./Hub";

const raw = (): SocketRaw & { sent: string[] } => {
  const sent: string[] = [];

  return {
    close: vi.fn(),
    on: vi.fn(),
    send: (data: Buffer | string) => {
      sent.push(String(data));
    },
    sent,
  };
};

describe(`push`, () => {
  it(`fans out to all sockets for the user`, () => {
    const hub = Hub();
    const a = raw();
    const b = raw();
    hub.add(`1`, a);
    hub.add(`1`, b);
    hub.push(`1`, `a.b`, 42);

    expect(a.sent).toHaveLength(1);
    expect(b.sent).toHaveLength(1);
    expect(Protocol.parse(a.sent[0] ?? ``)).toStrictEqual({ data: 42, path: `a.b`, seq: 1, type: `event` });
  });

  it(`increments seq per user path`, () => {
    const hub = Hub();
    const a = raw();
    hub.add(`1`, a);
    for (const amount of [1, 2]) {
      hub.push(`1`, `a.b`, amount);
    }

    expect(Protocol.parse(a.sent[0] ?? ``)).toMatchObject({ seq: 1 });
    expect(Protocol.parse(a.sent[1] ?? ``)).toMatchObject({ seq: 2 });
  });

  it(`is a no-op without sockets`, () => {
    const hub = Hub();

    expect(() => {
      hub.push(`1`, `a.b`, 1);
    }).not.toThrow();
  });
});

describe(`remove`, () => {
  it(`stops delivering after remove and cleans empty sets`, () => {
    const hub = Hub();
    const a = raw();
    hub.add(`1`, a);
    hub.remove(`1`, a);
    hub.push(`1`, `a.b`, 1);

    expect(a.sent).toHaveLength(0);

    hub.remove(`1`, a);
  });
});
