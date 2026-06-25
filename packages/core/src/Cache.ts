/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
export const Cache = <T>() => {
  const store = new Map<string, T>();
  const get = (key: string) => store.get(key);

  const set = (key: string, value: T) => {
    store.set(key, value);

    return value;
  };

  const remove = (key: string) => {
    store.delete(key);
  };

  const prune = (keep: (value: T) => boolean) => {
    for (const [key, value] of store) {
      if (!keep(value)) {
        store.delete(key);
      }
    }
  };

  return { get, prune, remove, set };
};

export type Cache = ReturnType<typeof Cache>;
