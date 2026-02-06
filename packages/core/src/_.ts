/* eslint-disable @typescript-eslint/naming-convention */
export const base64decode = (s: string): string => Buffer.from(s, `base64`).toString(`utf-8`);

export const _ = { base64decode };
