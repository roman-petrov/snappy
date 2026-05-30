/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */

const importShiki = async () => import(`shiki`);const cache: { shiki?: ReturnType<typeof importShiki> } = {};

const load = async () => {
  cache.shiki ??= importShiki();

  return cache.shiki;
};

const preload = () => {
  cache.shiki ??= importShiki();
};

export const Shiki = { load, preload };
