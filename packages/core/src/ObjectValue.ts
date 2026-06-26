/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
const entries = <TObject extends object>(value: TObject) =>
  Object.entries(value) as { [Key in keyof TObject]: [Key, TObject[Key]] }[keyof TObject][];

const fromEntries = <TKey extends number | string | symbol, TValue>(value: (readonly [TKey, TValue])[]) =>
  Object.fromEntries(value) as Record<TKey, TValue>;

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

export const ObjectValue = { entries, fromEntries, groupsInOrder, keys };
