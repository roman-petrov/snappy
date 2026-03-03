/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tsImport } from "tsx/esm/api";

export const ViteConfigLoader = async (moduleUrl: string) =>
  (await tsImport(pathToFileURL(path.join(path.dirname(fileURLToPath(moduleUrl)), `vite.config.ts`)).href, moduleUrl))
    .default;
