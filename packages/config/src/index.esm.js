import { register } from "tsx/esm/api";

const unregister = register();

export const { ESLintConfig } = await import(`./index.ts`);

await unregister();
