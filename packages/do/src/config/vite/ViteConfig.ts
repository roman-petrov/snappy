import { _ } from "@snappy/core";
import react from "@vitejs/plugin-react";
import { join } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { NodePackageImporter } from "sass-embedded";
import { type ConfigEnv, defineConfig, mergeConfig, type UserConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import pluginSassDts from "vite-plugin-sass-dts";

import { pluginFontPreload, pluginOptimizeCssModules } from "./plugins";

export type ViteConfigOptions = { analyzeFileName: string };

type EnvWithSsr = ConfigEnv & { ssrBuild?: boolean };

export const ViteConfig = (override: UserConfig, options: ViteConfigOptions) =>
  defineConfig((env: ConfigEnv) => {
    const { analyzeFileName } = options;
    const isSsr = (env as EnvWithSsr).ssrBuild === true;
    const analyzeFilePath = join(process.cwd(), `..`, `..`, `.analyze`, `${analyzeFileName}.html`);

    return mergeConfig(
      {
        css: {
          modules: { localsConvention: `camelCaseOnly` },
          preprocessorOptions: { scss: { importers: [new NodePackageImporter()] } },
        },
        plugins: [
          react(),
          pluginFontPreload(),
          pluginOptimizeCssModules(),
          pluginSassDts({
            esmExport: true,
            exportName: { replacement: fileName => `__${_.pascalCase(fileName.split(`.`)[0] ?? ``)}` },
            legacyFileFormat: true,
          }),
          ...(isSsr
            ? []
            : [
                compression({ algorithms: [`brotliCompress`] }),
                visualizer({ filename: analyzeFilePath, gzipSize: true }),
              ]),
        ],
        resolve: { dedupe: [`react`, `react-dom`] },
      },
      override,
    );
  });
