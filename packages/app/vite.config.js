import { ViteConfigLoader } from "@snappy/do/config/js";

export default await ViteConfigLoader(import.meta.url);
