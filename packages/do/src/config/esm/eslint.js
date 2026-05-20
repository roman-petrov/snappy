/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { register } from "tsx/esm/api";

const unregister = register();
const { ESLintConfig } = await import(`../eslint/ESLintConfig.ts`);

await unregister();

export default ESLintConfig;
