import { ViteConfigLoader } from "@snappy/do/config/js/vite";

export default await ViteConfigLoader(import.meta.url);
