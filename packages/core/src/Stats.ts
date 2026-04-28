/* eslint-disable unicorn/no-array-reduce */
const stats = (reducer: (previous: number, current: number) => number) => (values: number[]) => {
  const [first, ...rest] = values;
  if (first === undefined) {
    return undefined;
  }

  return rest.reduce(reducer, first);
};

const max = stats((previous, current) => Math.max(previous, current));
const sum = stats((previous, current) => previous + current);

const mean = (values: number[]) => {
  if (values.length === 0) {
    return undefined;
  }
  const total = sum(values);

  return total === undefined ? undefined : total / values.length;
};

export const Stats = { max, mean, sum };
