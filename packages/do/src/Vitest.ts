import { Run } from "./Run";

const run = (update = false) => Run.tool(`vitest`, [`run`, ...(update ? [`--update`] : [])]);

export const Vitest = { run };
