/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import { Dom } from "@snappy/browser";
import { _, type Action } from "@snappy/core";

const dbName = `snappy-chat-feed`;
const storeName = `feed`;
const recordId = `global`;

export type FeedArtifact =
  | { generationPrompt: string; html: string; id: string; type: `text` }
  | { generationPrompt: string; id: string; src: string; type: `image` };

export type FeedArtifactInput =
  | Omit<Extract<FeedArtifact, { type: `image` }>, `id`>
  | Omit<Extract<FeedArtifact, { type: `text` }>, `id`>;

export type FeedArtifactPatch = { html?: string; src?: string };

type FeedRecord = { artifacts: FeedArtifact[]; id: string };

const clone = (artifacts: FeedArtifact[]) => artifacts.map(item => ({ ...item }));

const idbUntilDone = async <T = void>(
  source: IDBRequest<T> | IDBTransaction,
  done: `complete` | `success`,
  extra: readonly Action[] = [],
): Promise<T> =>
  new Promise((resolve, reject) => {
    let dispose = _.noop;

    const onOk =
      done === `success`
        ? Dom.subscribe(source, `success`, () => {
            dispose();
            resolve((source as IDBRequest<T>).result);
          })
        : Dom.subscribe(source, `complete`, () => {
            dispose();
            resolve(undefined as T);
          });

    dispose = _.singleAction([
      ...extra,
      Dom.subscribe(source, `error`, () => {
        dispose();
        reject(source.error);
      }),
      onOk,
    ]);
  });

const openDb = async () => {
  const request = indexedDB.open(dbName);

  return idbUntilDone(request, `success`, [
    Dom.subscribe(request, `upgradeneeded`, () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: `id` });
      }
    }),
  ]);
};

const read = async (): Promise<FeedArtifact[]> => {
  const db = await openDb();
  const tx = db.transaction(storeName, `readonly`);
  const request = tx.objectStore(storeName).get(recordId);
  const raw = await idbUntilDone<FeedRecord | undefined>(request, `success`);

  return clone(raw?.artifacts ?? []);
};

const writeAll = async (artifacts: FeedArtifact[]) => {
  const db = await openDb();
  const tx = db.transaction(storeName, `readwrite`);
  const settled = idbUntilDone(tx, `complete`);
  tx.objectStore(storeName).put({ artifacts: clone(artifacts), id: recordId } satisfies FeedRecord);
  await settled;
};

const append = async (items: FeedArtifactInput[]): Promise<FeedArtifact[]> => {
  const next = [
    ...(await read()),
    ...items.map(
      (item): FeedArtifact =>
        item.type === `text` ? { ...item, id: crypto.randomUUID() } : { ...item, id: crypto.randomUUID() },
    ),
  ];
  await writeAll(next);

  return clone(next);
};

const remove = async (id: string): Promise<FeedArtifact[]> => {
  const next = (await read()).filter(item => item.id !== id);
  await writeAll(next);

  return clone(next);
};

const patch = async (id: string, delta: FeedArtifactPatch): Promise<FeedArtifact[]> => {
  const next = (await read()).map(item => {
    if (item.id !== id) {
      return item;
    }
    if (item.type === `text`) {
      return delta.html === undefined ? item : { ...item, html: delta.html };
    }

    return delta.src === undefined ? item : { ...item, src: delta.src };
  });
  await writeAll(next);

  return clone(next);
};

const clear = async (): Promise<FeedArtifact[]> => {
  await writeAll([]);

  return [];
};

export const ChatFeed = { append, clear, patch, read, remove };

export type ChatFeed = typeof ChatFeed;
