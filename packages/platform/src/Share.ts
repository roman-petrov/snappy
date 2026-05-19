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

  const { blob, extension, type } = await PlatformCommon.imageBlob(src);
  const file = new File([blob], `snappy-image.${extension}`, { type });
  await navigator.share({ files: [file], title });
};

export const Share = { html, image };
