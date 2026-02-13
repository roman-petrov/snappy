import { tsImport } from "tsx/esm/api";

export default (await tsImport(`./vite.app.config.ts`, import.meta.url)).default;
