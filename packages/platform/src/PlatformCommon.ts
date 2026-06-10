const plainText = (html: string) => new DOMParser().parseFromString(html, `text/html`).body.textContent;

const imageBlob = async (src: string) => {
  const blob = await fetch(src).then(async response => response.blob());
  const type = blob.type.startsWith(`image/`) ? blob.type : `image/png`;
  const extension = type.includes(`jpeg`) || type.includes(`jpg`) ? `jpg` : `png`;
  const base64 = new Uint8Array(await blob.arrayBuffer()).toBase64();

  return { base64, blob, extension, type };
};

export const PlatformCommon = { imageBlob, plainText };
