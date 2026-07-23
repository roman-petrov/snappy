import { ViteConfig } from "@snappy/do/config/vite";

export default ViteConfig({ server: { port: 5174, strictPort: true } }, { analyzeFileName: `ai-stream-lab` });
