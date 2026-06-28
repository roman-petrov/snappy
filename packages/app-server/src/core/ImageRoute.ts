import { MimeType } from "@snappy/core";

const prefix = `/api/image/`;
const mount = `${prefix}:key${MimeType.pngSuffix}`;
const url = (key: string) => `${prefix}${key}${MimeType.pngSuffix}`;

export const ImageRoute = { mount, url };
