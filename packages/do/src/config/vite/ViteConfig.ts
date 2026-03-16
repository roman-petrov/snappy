/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { _ } from "@snappy/core";
import react from "@vitejs/plugin-react";
import { join } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { NodePackageImporter } from "sass-embedded";
import { type ConfigEnv, defineConfig, mergeConfig, type UserConfig } from "vite";
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
        build: {
          rollupOptions: {
            output: isSsr
              ? undefined
              : {
                  chunkFileNames: `assets/[name]-[hash].js`,
                  codeSplitting: { groups: [{ name: `vendor`, test: /node_modules|rolldown/u }] },
                },
          },
        },
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
          ...(isSsr ? [] : [visualizer({ filename: analyzeFilePath, gzipSize: true })]),
        ],
        resolve: { dedupe: [`react`, `react-dom`, `react-router-dom`] },
      },
      override,
    );
  });
