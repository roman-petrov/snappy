/* eslint-disable functional/no-expression-statements */
const copy = async (text: string) => navigator.clipboard.writeText(text);

const copyHtml = async (html: string) => {
  const text = new DOMParser().parseFromString(html, `text/html`).body.textContent;

  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], { type: `text/html` }),
      "text/plain": new Blob([text], { type: `text/plain` }),
    }),
  ]);
};

const copyImage = async (src: string) => {
  const blob = await fetch(src).then(async response => response.blob());
  const type = blob.type.startsWith(`image/`) ? blob.type : `image/png`;

  await navigator.clipboard.write([new ClipboardItem({ [type]: blob })]);
};

export const Clipboard = { copy, copyHtml, copyImage };
