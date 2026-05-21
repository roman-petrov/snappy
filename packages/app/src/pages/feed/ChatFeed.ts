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
  | { generationPrompt: string; id: string; src: string; type: `image` }
  | { generationPrompt: string; id: string; text: string; type: `text` };

export type FeedArtifactPatch = { src?: string; text?: string };

type FeedRecord = { artifacts: FeedArtifact[]; id: string };

const ok = (item: unknown): item is FeedArtifact => {
  if (!_.isObject(item)) {
    return false;
  }
  const row = item as Record<string, unknown>;
  const { generationPrompt, id, src, text, type } = row;

  return (
    _.isString(id) &&
    _.isString(generationPrompt) &&
    ((type === `image` && _.isString(src)) || (type === `text` && _.isString(text)))
  );
};

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
  const list = _.isArray(raw?.artifacts) ? raw.artifacts : [];

  return clone(list.filter(ok));
};

const writeAll = async (artifacts: FeedArtifact[]) => {
  const db = await openDb();
  const tx = db.transaction(storeName, `readwrite`);
  const settled = idbUntilDone(tx, `complete`);
  tx.objectStore(storeName).put({ artifacts: clone(artifacts), id: recordId } satisfies FeedRecord);
  await settled;
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
      return delta.text === undefined ? item : { ...item, text: delta.text };
    }

    return delta.src === undefined ? item : { ...item, src: delta.src };
  });
  await writeAll(next);

  return clone(next);
};

const upsert = async (artifact: FeedArtifact) => {
  const items = await read();
  const index = items.findIndex(item => item.id === artifact.id);

  const next =
    index === -1 ? [...items, artifact] : items.map((item, itemIndex) => (itemIndex === index ? artifact : item));
  await writeAll(next);

  return clone(next);
};

const clear = async () => {
  await writeAll([]);

  return [];
};

export const ChatFeed = { clear, patch, read, remove, upsert };

export type ChatFeed = typeof ChatFeed;
