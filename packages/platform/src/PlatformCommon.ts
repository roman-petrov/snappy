const plainText = (html: string) => new DOMParser().parseFromString(html, `text/html`).body.textContent;

const imageInfo = (src: string) => {
  const comma = src.indexOf(`,`);
  const mime = src.slice(`data:`.length, comma).split(`;`)[0] ?? `image/png`;
  const base64 = src.slice(comma + 1);
  const extension = mime.includes(`jpeg`) || mime.includes(`jpg`) ? `jpg` : `png`;

  return { base64, extension, mime };
};

const imageBlob = async (src: string) => {
  const blob = await fetch(src).then(async response => response.blob());
  const type = blob.type.startsWith(`image/`) ? blob.type : `image/png`;
  const extension = type.slice(type.indexOf(`/`) + 1);

  return { blob, extension, type };
};

export const PlatformCommon = { imageBlob, imageInfo, plainText };
