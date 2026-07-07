import { Run } from "./Run";

const config = `packages/do/vitest.config.ts`;
const run = (update = false) => Run.tool(`vitest`, [`run`, ...(update ? [`--update`] : []), `--config`, config]);

export const Vitest = { run };
