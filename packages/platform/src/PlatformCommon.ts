const plainText = (html: string) => new DOMParser().parseFromString(html, `text/html`).body.textContent;

const imageInfo = (src: string) => {
  const comma = src.indexOf(`,`);
  const mime = src.slice(`data:`.length, comma).split(`;`)[0] ?? `image/png`;
  const base64 = src.slice(comma + 1);
  const extension = mime.includes(`jpeg`) || mime.includes(`jpg`) ? `jpg` : `png`;

  return { base64, extension, mime };
};

export const PlatformCommon = { imageInfo, plainText };
