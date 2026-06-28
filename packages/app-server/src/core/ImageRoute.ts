const prefix = `/api/image/`;
const suffix = `.png`;
const url = (key: string) => `${prefix}${key}${suffix}`;

export const ImageRoute = { mount: `${prefix}:key${suffix}`, url };
