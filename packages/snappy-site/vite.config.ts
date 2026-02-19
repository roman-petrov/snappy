import { execSync } from "node:child_process";
import { join } from "node:path";
import { defineConfig } from "vite";

const siteRoot = import.meta.dirname;
const uiRoot = join(siteRoot, `..`, `ui`);

const pandaCodegenPlugin = () => ({
  buildStart() {
    execSync(`bunx panda codegen`, { cwd: uiRoot, stdio: `inherit` });
    execSync(`bunx panda codegen`, { cwd: siteRoot, stdio: `inherit` });
  },
  name: `panda-codegen`,
});

export default defineConfig({
  build: { outDir: `dist`, rollupOptions: { input: [`src/site/index.html`] } },
  plugins: [pandaCodegenPlugin()],
  resolve: { alias: { "/app": join(siteRoot, `src`, `app`) } },
});
