/* eslint-disable functional/no-promise-reject */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { Store } from "@snappy/core";

const dbName = `snappy-chat-feed`;
const storeName = `feed`;
const recordId = `global`;
const version = 2;

export type FeedArtifact = (
  | { agentId: string; html: string; type: `text` }
  | { agentId: string; src: string; type: `image` }
) & { generationPrompt: string; id: string };

export type FeedArtifactPatch = { generationPrompt?: string; html?: string; src?: string };

export type RegenerateArtifactInput = { kind: `image` | `text`; messageId: string };

type FeedRecord = { artifacts: FeedArtifact[]; id: string };

const isArtifact = (value: unknown): value is FeedArtifact => {
  if (
    typeof value !== `object` ||
    value === null ||
    !(`id` in value) ||
    !(`agentId` in value) ||
    !(`generationPrompt` in value) ||
    !(`type` in value)
  ) {
    return false;
  }
  const item = value as {
    agentId?: unknown;
    generationPrompt?: unknown;
    html?: unknown;
    id?: unknown;
    src?: unknown;
    type?: unknown;
  };
  if (typeof item.id !== `string` || typeof item.agentId !== `string` || typeof item.generationPrompt !== `string`) {
    return false;
  }

  return (
    (item.type === `text` && typeof item.html === `string`) || (item.type === `image` && typeof item.src === `string`)
  );
};

const feedRecord = (value: unknown): FeedRecord | undefined => {
  if (typeof value !== `object` || value === null || !(`id` in value) || !(`artifacts` in value)) {
    return undefined;
  }
  if (typeof value.id !== `string` || !Array.isArray(value.artifacts) || !value.artifacts.every(isArtifact)) {
    return undefined;
  }

  return { artifacts: value.artifacts, id: value.id };
};

export const ChatFeed = () => {
  const state = Store<FeedArtifact[]>([]);
  let ready: Promise<void> | undefined;
  const clone = (artifacts: FeedArtifact[]) => artifacts.map(item => ({ ...item }));

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

  const readDb = async (): Promise<FeedArtifact[]> => {
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
        resolve(clone(record?.artifacts ?? []));
      };
    });
  };

  const writeDb = async (artifacts: FeedArtifact[]) => {
    if (typeof indexedDB === `undefined`) {
      return;
    }
    const db = await openDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, `readwrite`);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.objectStore(storeName).put({ artifacts: clone(artifacts), id: recordId } satisfies FeedRecord);
    });
  };

  const ensureReady = async () => {
    ready ??= (async () => {
      state.set(await readDb());
    })();

    await ready;
  };

  const appendArtifacts = async (items: Omit<FeedArtifact, `id`>[]) => {
    await ensureReady();
    const next = [...state(), ...items.map(item => ({ ...item, id: crypto.randomUUID() }) as FeedArtifact)];
    state.set(next);
    await writeDb(next);
  };

  const removeArtifact = async (id: string) => {
    await ensureReady();
    const next = state().filter(item => item.id !== id);
    state.set(next);
    await writeDb(next);
  };

  const patchArtifact = async (id: string, patch: FeedArtifactPatch) => {
    await ensureReady();
    const next = state().map(item => (item.id === id ? { ...item, ...patch } : item));
    state.set(next);
    await writeDb(next);
  };

  const clear = async () => {
    state.set([]);
    await writeDb([]);
  };

  const list = () => clone(state());

  const subscribe = (listener: (artifacts: FeedArtifact[]) => void) => {
    void ensureReady();

    return state.subscribe(current => listener(clone(current)));
  };

  void ensureReady();

  return { appendArtifacts, clear, list, patchArtifact, removeArtifact, subscribe };
};

export type ChatFeed = ReturnType<typeof ChatFeed>;
