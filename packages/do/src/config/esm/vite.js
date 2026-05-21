/* eslint-disable unicorn/filename-case */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { Tsx } from "./core/Tsx.js";

export const ViteConfigLoader = async moduleUrl =>
  (
    await Tsx.import(
      () => import(pathToFileURL(path.join(path.dirname(fileURLToPath(moduleUrl)), `vite.config.ts`)).href),
    )
  ).default;
