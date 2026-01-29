import { register } from "tsx/esm/api";

const unregister = register();

export const { CSpellConfig, ESLintConfig, PrettierConfig } = await import(`./index.ts`);

await unregister();
