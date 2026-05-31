/* eslint-disable functional/no-expression-statements */
import { register } from "tsx/esm/api";

const run = async load => {
  const unregister = register();
  const loaded = await load();
  await unregister();

  return loaded;
};

export const Tsx = { import: run };
