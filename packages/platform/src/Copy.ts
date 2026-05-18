/* eslint-disable functional/no-expression-statements */
import { Bridge } from "./Bridge";
import { PlatformCommon } from "./PlatformCommon";

const html = async (value: string) => {
  const plain = PlatformCommon.plainText(value);

  if (Bridge.available) {
    Bridge.copyHtml(value, plain);

    return;
  }

  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([value], { type: `text/html` }),
      "text/plain": new Blob([plain], { type: `text/plain` }),
    }),
  ]);
};

const image = async (src: string) => {
  if (Bridge.available) {
    const { base64, extension } = PlatformCommon.imageInfo(src);
    Bridge.copyImage(base64, `clipboard`, extension);

    return;
  }

  const blob = await fetch(src).then(async response => response.blob());
  const type = blob.type.startsWith(`image/`) ? blob.type : `image/png`;

  await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
};

export const Copy = { html, image };
