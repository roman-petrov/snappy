/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
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

  return { get, remove, set };
};

export type Cache = ReturnType<typeof Cache>;
