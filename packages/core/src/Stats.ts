const stats = (reducer: (previous: number, current: number) => number) => (values: number[]) =>
  values.length === 0 ? undefined : values.reduce(reducer, 0);

const sum = stats((previous, current) => previous + current);

export const Stats = { sum };
