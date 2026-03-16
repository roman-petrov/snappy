/* eslint-disable functional/no-expression-statements */
import { _, Serializer, Store } from "@snappy/core";

export const SavedStore = async <T extends boolean | string>(
  name: string,
  defaultValue: T,
  { format, parse } = Serializer.identity<T>(),
) => {
  const cookieExpiresMs = _.day * _.daysInYear;
  const store = Store(defaultValue);

  if (typeof document !== `undefined`) {
    store.subscribe(value => {
      const stored = format(value);
      if (stored !== undefined) {
        void cookieStore.set({ expires: _.now() + cookieExpiresMs, name, path: `/`, value: stored });
        localStorage.setItem(name, stored);
      }
    });
    const cookieValue = await cookieStore.get(name);
    const raw = cookieValue?.value;
    if (raw !== undefined) {
      const next = parse(raw);
      if (next !== undefined) {
        store.set(next);
      }
    }
  }

  return store;
};
