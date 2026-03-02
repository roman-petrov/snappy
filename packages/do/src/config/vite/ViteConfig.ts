import { _ } from "@snappy/core";
import pluginReact from "@vitejs/plugin-react";
import { join } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { NodePackageImporter } from "sass-embedded";
import { type ConfigEnv, defineConfig, mergeConfig, type UserConfig } from "vite";
import pluginSassDts from "vite-plugin-sass-dts";

import { pluginOptimizeCssModules } from "./plugins";

export type ViteConfigOptions = { analyzeFileName: string };

type EnvWithSsr = ConfigEnv & { ssrBuild?: boolean };

export const ViteConfig = (override: UserConfig, { analyzeFileName }: ViteConfigOptions) =>
  defineConfig((env: ConfigEnv) => {
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
          pluginReact(),
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
