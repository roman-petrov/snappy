/* eslint-disable functional/no-expression-statements */
import { Bridge } from "./Bridge";
import { PlatformCommon } from "./PlatformCommon";

const html = async (value: string, title = `Snappy`) => {
  const plain = PlatformCommon.plainText(value);

  if (Bridge.available) {
    Bridge.shareHtml(value, plain, title);

    return;
  }

  const file = new File([value], `snappy.html`, { type: `text/html` });
  await navigator.share({ files: [file], title });
};

const image = async (src: string, title = `Snappy`) => {
  if (Bridge.available) {
    const { base64, extension, mime } = PlatformCommon.imageInfo(src);
    Bridge.shareImage(base64, mime, title, extension);

    return;
  }

  const blob = await fetch(src).then(async response => response.blob());
  const type = blob.type.startsWith(`image/`) ? blob.type : `image/png`;
  const extension = type.slice(type.indexOf(`/`) + 1);
  const file = new File([blob], `snappy-image.${extension}`, { type });
  await navigator.share({ files: [file], title });
};

export const Share = { html, image };
