const png = (bytes: Uint8Array) => `data:image/png;base64,${bytes.toBase64()}`;

export const DataUrl = { png };
