/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { FastifyReply, FastifyRequest } from "fastify";

import { PassThrough } from "node:stream";
import { describe, expect, it, vi } from "vitest";

import type { Balance } from "./Balance";

import { AiTunnelProxy } from "./AiTunnelProxy";

const request = (
  body: unknown,
  { headers = {}, raw = {} }: { headers?: Record<string, string>; raw?: unknown } = {},
): FastifyRequest => ({ body, headers, raw }) as unknown as FastifyRequest;

const reply = () => {
  const raw = new PassThrough() as PassThrough & { writeHead: ReturnType<typeof vi.fn> };
  Object.defineProperty(raw, `writeHead`, { value: vi.fn(), writable: true });
  const value = { headers: vi.fn(), hijack: vi.fn(), raw, send: vi.fn(), status: vi.fn() };
  value.status.mockReturnValue(value);
  value.headers.mockReturnValue(value);

  return value as unknown as FastifyReply & {
    headers: ReturnType<typeof vi.fn>;
    hijack: ReturnType<typeof vi.fn>;
    raw: PassThrough & { writeHead: ReturnType<typeof vi.fn> };
    send: ReturnType<typeof vi.fn>;
    status: ReturnType<typeof vi.fn>;
  };
};

const balance = ({ blocked = false }: { blocked?: boolean } = {}): Balance =>
  ({
    debitForLlm: vi.fn().mockResolvedValue(undefined),
    isLlmBlocked: vi.fn().mockResolvedValue(blocked),
  }) as unknown as Balance;

describe(`aiTunnelProxy`, () => {
  it(`returns notFound for unknown route`, async () => {
    const proxy = AiTunnelProxy({ aiTunnelKey: `key`, balance: balance() });
    const response = reply();

    await proxy(`u1`, `unknown`, request({}), response);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledWith({ status: `notFound` });

    vi.restoreAllMocks();
  });

  it(`returns balanceBlocked and does not call fetch`, async () => {
    const blockedBalance = balance({ blocked: true });
    const fetchSpy = vi.spyOn(globalThis, `fetch`);
    const proxy = AiTunnelProxy({ aiTunnelKey: `key`, balance: blockedBalance });
    const response = reply();

    await proxy(`u2`, `chat/completions`, request({ model: `gpt-x` }), response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith({ status: `balanceBlocked` });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(blockedBalance.debitForLlm).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it(`proxies json chat response and debits by usage cost`, async () => {
    const usedBalance = balance();

    const fetchSpy = vi
      .spyOn(globalThis, `fetch`)
      .mockResolvedValue(
        Response.json(
          { id: `chat-1`, usage: { cost_rub: 1.25 } },
          { headers: { "Content-Encoding": `gzip`, "Content-Type": `application/json`, "X-Test": `ok` }, status: 201 },
        ),
      );

    const proxy = AiTunnelProxy({ aiTunnelKey: `token-123`, balance: usedBalance });
    const response = reply();

    await proxy(`u3`, `chat/completions`, request({ model: `chat-pro`, stream: false }), response);

    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];

    expect((init.headers as Headers).get(`Authorization`)).toBe(`Bearer token-123`);
    expect(response.status).toHaveBeenCalledWith(201);

    expect(response.headers).toHaveBeenCalledWith({ "content-type": `application/json`, "x-test": `ok` });
    expect(response.send).toHaveBeenCalledWith({ id: `chat-1`, usage: { cost_rub: 1.25 } });

    expect(usedBalance.debitForLlm).toHaveBeenCalledWith(`u3`, 1.25, { call: `chat`, model: `chat-pro` });

    vi.restoreAllMocks();
  });

  it(`streams chat response and debits only once from sse payload`, async () => {
    const usedBalance = balance();

    const sse =
      `data: {"id":"a","usage":{"cost_rub":2}}\n\n` +
      `data: {"id":"b","usage":{"cost_rub":9}}\n\n` +
      `data: [DONE]\n\n`;

    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(sse));
        controller.close();
      },
    });
    vi.spyOn(globalThis, `fetch`).mockResolvedValue(
      new Response(body, { headers: { "Content-Type": `text/event-stream` }, status: 200 }),
    );
    const proxy = AiTunnelProxy({ aiTunnelKey: `token-123`, balance: usedBalance });
    const response = reply();

    await proxy(`u4`, `chat/completions`, request({ model: `gpt-4.1`, stream: true }), response);
    await new Promise<void>(resolve => {
      setTimeout(() => resolve(), 0);
    });

    expect(response.hijack).toHaveBeenCalledTimes(1);
    expect(response.raw.writeHead).toHaveBeenCalledWith(200, { "content-type": `text/event-stream` });
    expect(usedBalance.debitForLlm).toHaveBeenCalledTimes(1);
    expect(usedBalance.debitForLlm).toHaveBeenCalledWith(`u4`, 2, { call: `chat`, model: `gpt-4.1` });

    vi.restoreAllMocks();
  });

  it(`proxies image generation response and debits as image call`, async () => {
    const usedBalance = balance();
    vi.spyOn(globalThis, `fetch`).mockResolvedValue(
      Response.json(
        { data: [{ url: `https://img` }], usage: { cost_rub: 3.5 } },
        { headers: { "Content-Type": `application/json` }, status: 200 },
      ),
    );

    const proxy = AiTunnelProxy({ aiTunnelKey: `token-123`, balance: usedBalance });
    const response = reply();

    await proxy(`u5`, `images/generations`, request({ model: `gpt-image-1`, prompt: `cat` }), response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.send).toHaveBeenCalledWith({ data: [{ url: `https://img` }], usage: { cost_rub: 3.5 } });
    expect(usedBalance.debitForLlm).toHaveBeenCalledWith(`u5`, 3.5, { call: `image`, model: `gpt-image-1` });

    vi.restoreAllMocks();
  });

  it(`does not debit when image response has no usage cost`, async () => {
    const usedBalance = balance();
    vi.spyOn(globalThis, `fetch`).mockResolvedValue(
      Response.json({ data: [{ b64_json: `abc` }] }, { headers: { "Content-Type": `application/json` }, status: 200 }),
    );

    const proxy = AiTunnelProxy({ aiTunnelKey: `token-123`, balance: usedBalance });
    const response = reply();

    await proxy(`u6`, `images/generations`, request({ model: `gpt-image-1`, prompt: `cat` }), response);

    expect(usedBalance.debitForLlm).not.toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it(`proxies speech transcription and forwards multipart content-type`, async () => {
    const usedBalance = balance();
    const rawBody = { stream: `binary` };

    const fetchSpy = vi
      .spyOn(globalThis, `fetch`)
      .mockResolvedValue(
        Response.json(
          { text: `hello`, usage: { cost_rub: 0.75 } },
          { headers: { "Content-Type": `application/json`, "X-Trace": `1` }, status: 202 },
        ),
      );

    const proxy = AiTunnelProxy({ aiTunnelKey: `token-123`, balance: usedBalance });
    const response = reply();

    await proxy(
      `u7`,
      `audio/transcriptions`,
      request(undefined, { headers: { "content-type": `multipart/form-data; boundary=abc` }, raw: rawBody }),
      response,
    );

    const [, init] = fetchSpy.mock.calls[0] as [string, RequestInit];

    expect(init.body).toBe(rawBody as unknown as BodyInit);
    expect((init.headers as Headers).get(`Content-Type`)).toBe(`multipart/form-data; boundary=abc`);
    expect(response.status).toHaveBeenCalledWith(202);
    expect(response.headers).toHaveBeenCalledWith({ "content-type": `application/json`, "x-trace": `1` });
    expect(usedBalance.debitForLlm).toHaveBeenCalledWith(`u7`, 0.75, { call: `speechRecognition`, model: `` });

    vi.restoreAllMocks();
  });
});
