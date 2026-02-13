import { tsImport } from "tsx/esm/api";

export default (await tsImport(`./vite.config.ts`, import.meta.url)).default;
