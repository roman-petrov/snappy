/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-try-statements */
import type { RelayOfferedModel } from "@snappy/server-api";

import { type ChatCompletionResponse, type ChatRequest, LlmErrors } from "@snappy/ai";
import { randomUUID } from "node:crypto";

const minRelayKeyLength = 32;
const requestTimeoutMs = 120_000;

type ClientPayload =
  | { id: string; json: unknown; ok: true; type: `ollamaResult` }
  | { id: string; ok: false; status: number; type: `ollamaResult` };

type Pending = {
  reject: (error: Error) => void;
  resolve: (v: unknown) => void;
  timeout: ReturnType<typeof setTimeout>;
};

type Purpose = `chat` | `image`;

type RelayMeta = { inflight: number; offered: RelayOfferedModel[]; public: boolean };

type ServerToClient = { body: unknown; id: string; path: string; type: `ollama` };

type SocketLike = {
  close: () => void;
  on: (event: `close` | `message`, fn: (data?: Buffer | string) => void) => void;
  send: (data: string) => void;
};

const normalizeLegacyNames = (names: string[]): RelayOfferedModel[] =>
  names.map(name => ({ capabilities: [`chat` as const], name }));

const parseOffered = (raw: unknown): RelayOfferedModel[] | undefined => {
  if (raw === undefined) {
    return undefined;
  }
  if (!Array.isArray(raw)) {
    return undefined;
  }
  const out: RelayOfferedModel[] = [];
  for (const item of raw) {
    if (typeof item === `string`) {
      out.push({ capabilities: [`chat`], name: item });
      continue;
    }
    if (
      item !== null &&
      typeof item === `object` &&
      `name` in item &&
      typeof (item as { name: unknown }).name === `string`
    ) {
      const { name } = item as { name: string };
      const capsRaw = (item as { capabilities?: unknown }).capabilities;
      const capabilities: (`chat` | `image`)[] = [];
      if (Array.isArray(capsRaw)) {
        for (const c of capsRaw) {
          if (c === `chat` || c === `image`) {
            capabilities.push(c);
          }
        }
      }
      if (capabilities.length === 0) {
        capabilities.push(`chat`);
      }
      out.push({ capabilities, name });
    }
  }

  return out;
};

export const bridgeRegistry = () => {
  const sockets = new Map<string, SocketLike>();
  const relayMeta = new Map<string, RelayMeta>();
  const pending = new Map<string, Pending>();

  const validateRelayKey = (relayKey: string): boolean =>
    relayKey.length >= minRelayKeyLength && /^[\da-f]+$/u.test(relayKey);

  const attachSocket = (
    relayKey: string,
    socket: SocketLike,
    meta: { offered: RelayOfferedModel[]; public: boolean } = { offered: [], public: false },
  ) => {
    const previous = sockets.get(relayKey);
    if (previous === socket) {
      relayMeta.set(relayKey, {
        inflight: relayMeta.get(relayKey)?.inflight ?? 0,
        offered: meta.offered,
        public: meta.public,
      });

      return;
    }
    if (previous !== undefined) {
      previous.close();
    }
    sockets.set(relayKey, socket);
    relayMeta.set(relayKey, {
      inflight: relayMeta.get(relayKey)?.inflight ?? 0,
      offered: meta.offered,
      public: meta.public,
    });
    socket.on(`close`, () => {
      if (sockets.get(relayKey) === socket) {
        sockets.delete(relayKey);
        relayMeta.delete(relayKey);
      }
    });
    socket.on(`message`, raw => {
      const text = typeof raw === `string` ? raw : (raw?.toString(`utf8`) ?? ``);
      let parsed: ClientPayload;
      try {
        parsed = JSON.parse(text) as ClientPayload;
      } catch {
        return;
      }
      if (parsed.type !== `ollamaResult`) {
        return;
      }
      const slot = pending.get(parsed.id);
      if (slot === undefined) {
        return;
      }
      clearTimeout(slot.timeout);
      pending.delete(parsed.id);
      if (parsed.ok) {
        slot.resolve(parsed.json);
      } else {
        slot.reject(new Error(`bridge_http_${String(parsed.status)}`));
      }
    });
  };

  const relayOffers = (meta: RelayMeta, modelName: string, purpose: Purpose): boolean => {
    if (meta.offered.length === 0) {
      return true;
    }

    return meta.offered.some(
      o =>
        o.name === modelName &&
        (purpose === `chat` ? o.capabilities.includes(`chat`) : o.capabilities.includes(`image`)),
    );
  };

  const pickPublicRelay = (modelName: string, purpose: Purpose): string | undefined => {
    type Cand = { inflight: number; key: string };

    const strict: Cand[] = [];
    const wildcard: Cand[] = [];
    for (const [key, meta] of relayMeta) {
      if (!meta.public || !sockets.has(key)) {
        continue;
      }
      if (relayOffers(meta, modelName, purpose)) {
        (meta.offered.length === 0 ? wildcard : strict).push({ inflight: meta.inflight, key });
      }
    }
    const pool = strict.length > 0 ? strict : wildcard;
    if (pool.length === 0) {
      return undefined;
    }
    pool.sort((a, b) => a.inflight - b.inflight);

    return pool[0]?.key;
  };

  const catalogFromOffered = (meta: RelayMeta): { chat: string[]; image: string[] } => {
    const chat = new Set<string>();
    const image = new Set<string>();
    for (const o of meta.offered) {
      if (o.capabilities.includes(`chat`)) {
        chat.add(o.name);
      }
      if (o.capabilities.includes(`image`)) {
        image.add(o.name);
      }
    }

    return { chat: [...chat].sort(), image: [...image].sort() };
  };

  const listCommunityCatalog = (): { chat: string[]; image: string[] } => {
    const chat = new Set<string>();
    const image = new Set<string>();
    for (const [, meta] of relayMeta) {
      if (!meta.public) {
        continue;
      }
      const part = catalogFromOffered(meta);
      for (const n of part.chat) {
        chat.add(n);
      }
      for (const n of part.image) {
        image.add(n);
      }
    }

    return { chat: [...chat].sort(), image: [...image].sort() };
  };

  const listRelayCatalog = (relayKey: string): { chat: string[]; image: string[] } => {
    if (!sockets.has(relayKey)) {
      return { chat: [], image: [] };
    }
    const meta = relayMeta.get(relayKey);

    return meta === undefined ? { chat: [], image: [] } : catalogFromOffered(meta);
  };

  const relayConnected = (relayKey: string): boolean => sockets.has(relayKey);

  const withInflight = async <T>(relayKey: string, run: () => Promise<T>): Promise<T> => {
    const m = relayMeta.get(relayKey);
    if (m !== undefined) {
      m.inflight += 1;
    }
    try {
      return await run();
    } finally {
      const m2 = relayMeta.get(relayKey);
      if (m2 !== undefined) {
        m2.inflight -= 1;
      }
    }
  };

  const request = async (relayKey: string, payload: ServerToClient): Promise<unknown> => {
    const socket = sockets.get(relayKey);
    if (socket === undefined) {
      throw new Error(LlmErrors.bridgeOffline);
    }

    return withInflight(
      relayKey,
      async () =>
        new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            pending.delete(payload.id);
            reject(new Error(`bridge_timeout`));
          }, requestTimeoutMs);
          pending.set(payload.id, { reject, resolve, timeout });
          socket.send(JSON.stringify(payload));
        }),
    );
  };

  const chatCompletion = async (relayKey: string, chatRequest: ChatRequest) => {
    const id = randomUUID();
    const json = await request(relayKey, { body: chatRequest, id, path: `/v1/chat/completions`, type: `ollama` });

    return json as ChatCompletionResponse;
  };

  const generatePng = async (relayKey: string, prompt: string, model: string): Promise<Uint8Array> => {
    const id = randomUUID();

    const json = (await request(relayKey, {
      body: { model, prompt, stream: false },
      id,
      path: `/api/generate`,
      type: `ollama`,
    })) as { b64?: string };

    const { b64 } = json;
    if (b64 === undefined || b64 === ``) {
      throw new Error(`bridge_image_empty`);
    }

    const binary = atob(b64);

    // eslint-disable-next-line unicorn/prefer-code-point -- bytes not Unicode code points
    return Uint8Array.from(binary, char => char.charCodeAt(0));
  };

  return {
    attachSocket,
    chatCompletion,
    generatePng,
    listCommunityCatalog,
    listRelayCatalog,
    normalizeLegacyNames,
    parseOffered,
    pickPublicRelay,
    relayConnected,
    validateRelayKey,
  };
};

export type BridgeRegistry = ReturnType<typeof bridgeRegistry>;
