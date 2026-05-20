/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { register } from "tsx/esm/api";

const unregister = register();
const { KnipConfig } = await import(`../knip/KnipConfig.ts`);

await unregister();

export default KnipConfig;
