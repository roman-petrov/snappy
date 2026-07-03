const apk = `application/vnd.android.package-archive`;
const eventStream = `text/event-stream`;
const imagePng = `image/png`;
const imageSvg = `image/svg+xml`;
const json = `application/json`;
const manifest = `application/manifest+json`;
const octetStream = `application/octet-stream`;
const textHtml = `text/html`;
const textPlain = `text/plain`;
const xml = `application/xml`;

export const MimeType = {
  apk,
  eventStream,
  imagePng,
  imageSvg,
  json,
  manifest,
  octetStream,
  textHtml,
  textPlain,
  xml,
} as const;

export type MimeType = (typeof MimeType)[keyof typeof MimeType];
