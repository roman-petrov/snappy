import { Mime, MimeType, Png } from "@snappy/core";

const plainText = (html: string) => new DOMParser().parseFromString(html, MimeType.textHtml).body.textContent;

const imageBlob = async (src: string): Promise<{ base64: string; blob: Blob; extension: string; type: MimeType }> => {
  const response = await fetch(src);
  const blob = await response.blob();
  const base64Value = Mime.base64(new Uint8Array(await blob.arrayBuffer()));

  return { base64: base64Value, blob, extension: Png.extension, type: MimeType.imagePng };
};

export const PlatformCommon = { imageBlob, plainText };
