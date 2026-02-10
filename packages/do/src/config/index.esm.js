/* eslint-disable functional/no-expression-statements */
import { register } from "tsx/esm/api";

const unregister = register();

export const { CSpellConfig, ESLintConfig, PrettierConfig, StyleLintConfig } = await import(`./index.ts`);

await unregister();
