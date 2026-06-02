const value = (header: string | undefined, name: string) => {
  if (header === undefined) {
    return undefined;
  }
  const part = header
    .split(`;`)
    .map(s => s.trim())
    .find(s => s.startsWith(`${name}=`));
  if (part === undefined) {
    return undefined;
  }
  const eq = part.indexOf(`=`);

  return eq === -1 ? undefined : part.slice(eq + 1);
};

const decoded = (header: string | undefined, name: string) => {
  const raw = value(header, name);

  return raw === undefined ? undefined : decodeURIComponent(raw);
};

export const Cookie = { decoded, value };
