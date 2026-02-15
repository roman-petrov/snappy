export type ApiErrorResult = { error: string; status: number };

export const hasError = (r: unknown): r is ApiErrorResult =>
  typeof r === `object` && r !== null && `error` in r && `status` in r;
