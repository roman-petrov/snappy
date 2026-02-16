import type { ApiError } from "@snappy/server-api";

const hasError = (r: unknown): r is ApiError => typeof r === `object` && r !== null && `error` in r && `status` in r;

export const ApiResult = { hasError };
