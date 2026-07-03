import { MimeType } from "./MimeType";

const base64 = (bytes: Uint8Array) =>
  typeof Buffer === `undefined` ? bytes.toBase64() : Buffer.from(bytes).toString(`base64`);

const dataUrl = (type: MimeType, bytes: Uint8Array) => `data:${type};base64,${base64(bytes)}`;
const pngDataUrl = (bytes: Uint8Array) => dataUrl(MimeType.imagePng, bytes);
const blob = async (raw: Blob) => `data:${raw.type};base64,${base64(new Uint8Array(await raw.arrayBuffer()))}`;

export const Mime = { base64, blob, dataUrl, pngDataUrl } as const;
