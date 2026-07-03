/* eslint-disable functional/no-expression-statements */
import { MimeType } from "@snappy/core";

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
      [MimeType.textHtml]: new Blob([value], { type: MimeType.textHtml }),
      [MimeType.textPlain]: new Blob([plain], { type: MimeType.textPlain }),
    }),
  ]);
};

const image = async (src: string) => {
  const { base64, blob, extension, type } = await PlatformCommon.imageBlob(src);

  if (Bridge.available) {
    Bridge.copyImage(base64, `clipboard`, extension);

    return;
  }

  await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
};

export const Copy = { html, image };
