import type { ApiError } from "@snappy/server-api";

export const hasError = (r: unknown): r is ApiError =>
  typeof r === `object` && r !== null && `error` in r && `status` in r;
