/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-expect-error There are no types for "eslint-plugin-promise"" at the moment.
import pluginPromise from "eslint-plugin-promise";
import { defineConfig } from "eslint/config";

export default defineConfig([pluginPromise.configs[`flat/recommended`]]);
