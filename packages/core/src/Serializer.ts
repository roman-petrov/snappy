/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
export type Serializer<T> = { format: (value: T) => string | undefined; parse: (raw: string) => T | undefined };

const identity = <T extends boolean | string>(): Serializer<T> => ({
  format: value => value as unknown as string,
  parse: raw => raw as T,
});

const boolean: Serializer<boolean> = {
  format: value => (value ? `1` : `0`),
  parse: raw => (raw === `1` ? true : raw === `0` ? false : undefined),
};

export const Serializer = { boolean, identity };
