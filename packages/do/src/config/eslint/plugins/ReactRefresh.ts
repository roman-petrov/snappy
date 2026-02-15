import pluginReactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

/**
 * See https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#consistent-components-exports
 * to understand why do we need this plugin.
 */

export default defineConfig([pluginReactRefresh.configs.vite]);
