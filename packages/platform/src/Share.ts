/* eslint-disable functional/no-expression-statements */
const text = async (value: string, title = `Snappy`) => navigator.share({ text: value, title });

const image = async (src: string, title = `Snappy`) => {
  const blob = await fetch(src).then(async response => response.blob());
  const type = blob.type.startsWith(`image/`) ? blob.type : `image/png`;
  const extension = type.slice(type.indexOf(`/`) + 1);
  const file = new File([blob], `snappy-image.${extension}`, { type });
  await navigator.share({ files: [file], title });
};

export const Share = { image, text };
