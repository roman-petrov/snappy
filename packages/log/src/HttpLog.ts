import type { FastifyBaseLogger } from "fastify";

import { FileLogger } from "./FileLogger";

export const HttpLog = FileLogger(`http`) as FastifyBaseLogger;
