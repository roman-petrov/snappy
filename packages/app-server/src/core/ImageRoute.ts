const prefix = `/api/image/`;
const mount = `${prefix}:file`;
const url = (file: string) => `${prefix}${file}`;

export const ImageRoute = { mount, url };
