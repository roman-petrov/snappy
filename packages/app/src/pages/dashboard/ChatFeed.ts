/* eslint-disable functional/no-promise-reject */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ChatFeedMessage } from "@snappy/agents";

import { Store } from "@snappy/core";

const dbName = `snappy-chat-feed`;
const storeName = `feed`;
const recordId = `global`;
const version = 1;

export type AgentSessionCard = {
  agentEmoji?: string;
  agentName: string;
  entries: ChatFeedMessage[];
  id: string;
  status: AgentSessionStatus;
};

export type AgentSessionStatus = `done` | `error` | `stopped`;

export type ChatFeedArtifactPatch = { generationPrompt?: string; html?: string; src?: string };

export type RegenerateArtifactInput = { kind: `image` | `text`; messageId: string; sessionId?: string };

type FeedRecord = { id: string; sessions: AgentSessionCard[] };

const isSessionCard = (value: unknown): value is AgentSessionCard => {
  if (typeof value !== `object` || value === null) {
    return false;
  }
  if (!(`agentName` in value) || !(`entries` in value) || !(`id` in value) || !(`status` in value)) {
    return false;
  }

  return (
    typeof value.agentName === `string` &&
    Array.isArray(value.entries) &&
    typeof value.id === `string` &&
    (value.status === `done` || value.status === `error` || value.status === `stopped`)
  );
};

const feedRecord = (value: unknown): FeedRecord | undefined => {
  if (typeof value !== `object` || value === null) {
    return undefined;
  }
  if (!(`id` in value) || !(`sessions` in value)) {
    return undefined;
  }
  if (typeof value.id !== `string` || !Array.isArray(value.sessions) || !value.sessions.every(isSessionCard)) {
    return undefined;
  }

  return { id: value.id, sessions: value.sessions };
};

export const ChatFeed = () => {
  const state = Store<AgentSessionCard[]>([]);
  let ready: Promise<void> | undefined;

  const cloneSessions = (sessions: AgentSessionCard[]) =>
    sessions.map(session => ({ ...session, entries: session.entries.map(entry => ({ ...entry })) }));

  const openDb = async () =>
    new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, version);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: `id` });
        }
      };
      request.onsuccess = () => resolve(request.result);
    });

  const readDb = async (): Promise<AgentSessionCard[]> => {
    if (typeof indexedDB === `undefined`) {
      return [];
    }
    const db = await openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, `readonly`);
      const request = tx.objectStore(storeName).get(recordId);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const record = feedRecord(request.result);
        resolve(cloneSessions(record?.sessions ?? []));
      };
    });
  };

  const writeDb = async (sessions: AgentSessionCard[]) => {
    if (typeof indexedDB === `undefined`) {
      return;
    }
    const db = await openDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, `readwrite`);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore(storeName).put({ id: recordId, sessions: cloneSessions(sessions) } satisfies FeedRecord);
    });
  };

  const ensureReady = async () => {
    ready ??= (async () => {
      const messages = await readDb();

      state.set(messages);
    })();

    await ready;
  };

  const appendSession = async (session: Omit<AgentSessionCard, `id`>): Promise<string> => {
    await ensureReady();
    const id = crypto.randomUUID();
    const next = [...state(), { ...session, id }];
    state.set(next);
    await writeDb(next);

    return id;
  };

  const removeSession = async (id: string) => {
    await ensureReady();
    const next = state().filter(item => item.id !== id);
    state.set(next);
    await writeDb(next);
  };

  const patchSessionEntry = async (sessionId: string, entryId: string, patch: ChatFeedArtifactPatch) => {
    await ensureReady();
    const next = state().map(session => {
      if (session.id !== sessionId) {
        return session;
      }

      return {
        ...session,
        entries: session.entries.map(entry => {
          if (entry.id !== entryId) {
            return entry;
          }
          if (entry.type === `text`) {
            return { ...entry, ...patch };
          }
          if (entry.type === `image`) {
            return { ...entry, ...patch };
          }

          return entry;
        }),
      };
    });
    state.set(next);
    await writeDb(next);
  };

  const clear = async () => {
    state.set([]);
    await writeDb([]);
  };

  const list = () => cloneSessions(state());

  const subscribe = (listener: (sessions: AgentSessionCard[]) => void) => {
    void ensureReady();

    return state.subscribe(current => listener(cloneSessions(current)));
  };

  void ensureReady();

  return { appendSession, clear, list, patchSessionEntry, removeSession, subscribe };
};

export type ChatFeed = ReturnType<typeof ChatFeed>;
