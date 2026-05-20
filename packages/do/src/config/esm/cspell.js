/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { register } from "tsx/esm/api";

const unregister = register();
const { CSpellConfig } = await import(`../cspell/CSpellConfig.ts`);

await unregister();

export default CSpellConfig;
