/* eslint-disable functional/no-expression-statements */
import { Bridge } from "./Bridge";

const copy = async (text: string) => {
  if (Bridge.available) {
    Bridge.copyText(text);

    return;
  }

  await navigator.clipboard.writeText(text);
};

const copyHtml = async (html: string) => {
  const text = new DOMParser().parseFromString(html, `text/html`).body.textContent;

  if (Bridge.available) {
    Bridge.copyHtml(html, text);

    return;
  }
  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], { type: `text/html` }),
      "text/plain": new Blob([text], { type: `text/plain` }),
    }),
  ]);
};

const copyImage = async (src: string) => {
  if (Bridge.available) {
    Bridge.copyImage(src);

    return;
  }
  const blob = await fetch(src).then(async response => response.blob());
  const type = blob.type.startsWith(`image/`) ? blob.type : `image/png`;

  await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
};

export const Clipboard = { copy, copyHtml, copyImage };
