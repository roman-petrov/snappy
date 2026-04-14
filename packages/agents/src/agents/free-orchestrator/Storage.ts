/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
type StorageEntry =
  | { generationPrompt: string; kind: `image`; value: Uint8Array }
  | { generationPrompt: string; kind: `text`; value: string };

export const Storage = () => {
  const files = new Map<string, StorageEntry>();

  const cloneEntry = (entry: StorageEntry): StorageEntry =>
    entry.kind === `image`
      ? { generationPrompt: entry.generationPrompt, kind: `image`, value: new Uint8Array(entry.value) }
      : { generationPrompt: entry.generationPrompt, kind: `text`, value: entry.value };

  const read = (name: string) => {
    const entry = files.get(name);
    if (entry === undefined) {
      return { error: `not_found` } as const;
    }

    return { result: cloneEntry(entry) } as const;
  };

  const write = (name: string, entry: StorageEntry) => {
    if (files.has(name)) {
      return { error: `already_exists` } as const;
    }

    files.set(name, cloneEntry(entry));

    return { result: `written` } as const;
  };

  const has = (name: string) => files.has(name);
  const list = () => ({ result: [...files.entries()].map(([name, entry]) => ({ kind: entry.kind, name })) }) as const;

  return { has, list, read, write };
};

export type StorageApi = ReturnType<typeof Storage>;

export type { StorageEntry };
