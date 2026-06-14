const encode = (type: string, bytes: Uint8Array) => `data:${type};base64,${bytes.toBase64()}`;
const blob = async (raw: Blob) => encode(raw.type, new Uint8Array(await raw.arrayBuffer()));
const png = (bytes: Uint8Array) => encode(`image/png`, bytes);

export const DataUrl = { blob, png };
