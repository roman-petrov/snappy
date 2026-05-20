/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { register } from "tsx/esm/api";

const unregister = register();
const { ViteConfigLoader } = await import(`../vite/ViteConfigLoader.ts`);

await unregister();

export { ViteConfigLoader };
