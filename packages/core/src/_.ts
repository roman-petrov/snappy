/* eslint-disable @typescript-eslint/naming-convention */
const base64decode = (s: string): string => Buffer.from(s, `base64`).toString(`utf-8`);
const camelCase = (s: string): string => s.replaceAll(/-(?<c>[a-z])/gu, (_, c: string) => c.toUpperCase());

export const _ = { base64decode, camelCase };
