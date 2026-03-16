const parseNullable = <T, R>(row: null | T, parse: (value: T) => R): R | undefined =>
  row === null ? undefined : parse(row);

export const DbTools = { parseNullable };
