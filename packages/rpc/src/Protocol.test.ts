/* @vitest-environment node */
import { describe, expect, it } from "vitest";

import { Protocol } from "./Protocol";

const { parse, stringify } = Protocol;

describe(`stringify`, () => {
  it(`round-trips a request`, () => {
    const message = { id: `1`, input: { n: 1 }, path: `a.b` };

    expect(parse(stringify(message))).toStrictEqual(message);
  });

  it(`round-trips ok and error responses`, () => {
    expect(parse(stringify({ data: 1, id: `1`, ok: true }))).toStrictEqual({ data: 1, id: `1`, ok: true });
    expect(parse(stringify({ error: { code: `UNAUTHORIZED` }, id: `2`, ok: false }))).toStrictEqual({
      error: { code: `UNAUTHORIZED`, message: undefined },
      id: `2`,
      ok: false,
    });
  });
});

describe(`parse`, () => {
  it(`parses an event with seq`, () => {
    expect(parse(stringify({ data: 10, path: `a.b`, seq: 2, type: `event` }))).toStrictEqual({
      data: 10,
      path: `a.b`,
      seq: 2,
      type: `event`,
    });
  });

  it(`returns undefined for invalid payloads`, () => {
    expect(parse(`{`)).toBeUndefined();
    expect(parse(`[]`)).toBeUndefined();
    expect(parse(`{"id":1,"path":"a"}`)).toBeUndefined();
    expect(parse(`{"id":"1","ok":false,"error":{"code":"OTHER"}}`)).toBeUndefined();
    expect(parse(`{"id":"1","ok":false,"error":{"code":1}}`)).toBeUndefined();
    expect(parse(`{"type":"event","path":"a","seq":"1"}`)).toBeUndefined();
  });
});
