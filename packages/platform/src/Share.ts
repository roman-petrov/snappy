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
  const { base64, blob, extension, type } = await PlatformCommon.imageBlob(src);

  if (Bridge.available) {
    Bridge.shareImage(base64, type, title, extension);

    return;
  }

  const file = new File([blob], `snappy-image.${extension}`, { type });
  await navigator.share({ files: [file], title });
};

export const Share = { html, image };
