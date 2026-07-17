/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
const entries = <TObject extends object>(value: TObject) =>
  Object.entries(value) as { [Key in keyof TObject]: [Key, TObject[Key]] }[keyof TObject][];

const fromEntries = <TKey extends number | string | symbol, TValue>(value: (readonly [TKey, TValue])[]) =>
  Object.fromEntries(value) as Record<TKey, TValue>;

const filterEntries = <TObject extends object>(
  object: TObject,
  keep: (key: { [K in keyof TObject]: K }[keyof TObject], value: TObject[keyof TObject]) => boolean,
) => fromEntries(entries(object).filter(([key, value]) => keep(key, value)));

const mapEntries = <TObject extends object, TKey extends PropertyKey, TValue>(
  object: TObject,
  map: (key: { [K in keyof TObject]: K }[keyof TObject], value: TObject[keyof TObject]) => readonly [TKey, TValue],
) => fromEntries(entries(object).map(([key, value]) => map(key, value)));

const keys = <TKey extends keyof TObject, TObject extends Record<TKey, unknown>>(object: TObject) =>
  Object.keys(object) as TKey[];

const groupsInOrder = <TGroup extends string, TItem extends { group: TGroup }>(
  items: readonly TItem[],
  order: readonly TGroup[],
) => {
  const byGroup = Object.groupBy(items, item => item.group);

  return order.flatMap(id => {
    const groupItems = byGroup[id];

    return groupItems === undefined || groupItems.length === 0 ? [] : [{ id, items: groupItems }];
  });
};

export const ObjectValue = { entries, filterEntries, fromEntries, groupsInOrder, keys, mapEntries };
