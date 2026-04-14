/* eslint-disable functional/no-expression-statements */
const copy = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const copyHtml = async (html: string) => {
  const text = new DOMParser().parseFromString(html, `text/html`).body.textContent;

  await navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([html], { type: `text/html` }),
      "text/plain": new Blob([text], { type: `text/plain` }),
    }),
  ]);
};

export const Clipboard = { copy, copyHtml };
