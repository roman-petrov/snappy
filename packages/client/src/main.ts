/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { createHash } from "node:crypto";
import { homedir, hostname } from "node:os";

import { relayOffered } from "./offered";

const ollamaBase = `http://127.0.0.1:11434`;

const defaultBridgeUrl = () =>
  process.env[`SNAPPY_BRIDGE_URL`] !== undefined && process.env[`SNAPPY_BRIDGE_URL`] !== ``
    ? process.env[`SNAPPY_BRIDGE_URL`]
    : `wss://snappy-ai.ru/api/ws/bridge`;

/**
 * Stable across restarts for this OS user on this machine. Not a global uniqueness proof: two
 * machines could share hostname + similar layout (rare). Good enough to avoid rotating random keys.
 */
const machineRelayKey = (): string => {
  const raw = `${hostname()}\0${homedir()}\0${process.platform}`;

  return createHash(`sha256`).update(raw, `utf8`).digest(`hex`);
};

type ClientToServer =
  | { id: string; json: unknown; ok: true; type: `ollamaResult` }
  | { id: string; ok: false; status: number; type: `ollamaResult` };

type ServerToClient = { body: unknown; id: string; path: string; type: `ollama` };

const handleOllama = async (message: ServerToClient): Promise<ClientToServer> => {
  const target = `${ollamaBase}${message.path}`;

  const response = await fetch(target, {
    body: JSON.stringify(message.body),
    headers: { "Content-Type": `application/json` },
    method: `POST`,
  });
  if (!response.ok) {
    return { id: message.id, ok: false, status: response.status, type: `ollamaResult` };
  }
  if (message.path === `/api/generate`) {
    const data = (await response.json()) as { images?: string[] };
    const [b64] = data.images ?? [];

    return b64 === undefined
      ? { id: message.id, ok: false, status: 500, type: `ollamaResult` }
      : { id: message.id, json: { b64 }, ok: true, type: `ollamaResult` };
  }
  const json: unknown = await response.json();

  return { id: message.id, json, ok: true, type: `ollamaResult` };
};

const connectBridge = async (url: string) =>
  new Promise<WebSocket>((resolve, reject) => {
    const ws = new WebSocket(url);

    const onOpen = () => {
      ws.removeEventListener(`error`, onError);
      resolve(ws);
    };

    const onError = () => {
      ws.removeEventListener(`open`, onOpen);
      reject(new Error(`ws connect failed`));
    };
    ws.addEventListener(`open`, onOpen, { once: true });
    ws.addEventListener(`error`, onError, { once: true });
  });

const ollamaModelNames = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${ollamaBase}/api/tags`);
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as { models?: { name?: string }[] };

    return (data.models ?? []).map(m => m.name).filter((n): n is string => typeof n === `string`);
  } catch {
    return [];
  }
};

const run = async () => {
  const relayKey = machineRelayKey();
  const tagNames = await ollamaModelNames();
  const offered = relayOffered(tagNames);
  const relayPublic = process.env[`SNAPPY_RELAY_PUBLIC`] === `1`;
  console.log(`Snappy relay key (stable on this PC; set once in app settings or share):\n${relayKey}\n`);
  if (relayPublic) {
    console.log(`Public relay: ON (models: ${tagNames.length > 0 ? tagNames.join(`, `) : `none`})\n`);
  }

  const url = defaultBridgeUrl();
  if (url.startsWith(`wss://localhost`) || url.startsWith(`wss://127.0.0.1`)) {
    process.env[`NODE_TLS_REJECT_UNAUTHORIZED`] = `0`;
  }

  const maxAttempts = 30;
  const delayMs = 200;
  let ws: undefined | WebSocket;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      ws = await connectBridge(url);
      break;
    } catch {
      await new Promise<void>(r => {
        setTimeout(r, delayMs);
      });
    }
  }
  if (ws === undefined) {
    console.error(`WebSocket: could not connect to ${url}. Check SNAPPY_BRIDGE_URL and that the server is running.`);

    return;
  }

  setImmediate(() => {
    ws?.send(JSON.stringify({ offered, public: relayPublic, relayKey, type: `register` }));
  });

  ws.addEventListener(`message`, event => {
    void (async () => {
      const raw = typeof event.data === `string` ? event.data : ``;
      let message: ServerToClient;
      try {
        message = JSON.parse(raw) as ServerToClient;
      } catch {
        return;
      }
      if (message.type !== `ollama`) {
        return;
      }
      const out = await handleOllama(message);
      ws?.send(JSON.stringify(out));
    })();
  });
};

void run();
