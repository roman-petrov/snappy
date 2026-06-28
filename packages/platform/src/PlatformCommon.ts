import { Mime, MimeType } from "@snappy/core";

const plainText = (html: string) => new DOMParser().parseFromString(html, MimeType.textHtml).body.textContent;

const imageBlob = async (src: string) => {
  const blob = await fetch(src).then(async response => response.blob());
  const base64Value = Mime.base64(new Uint8Array(await blob.arrayBuffer()));

  return { base64: base64Value, blob, extension: MimeType.pngExtension, type: MimeType.imagePng };
};

export const PlatformCommon = { imageBlob, plainText };
