import type { FileRoute } from "@snappy/server-module";

type Entry = { isFile: () => boolean; name: string };

export const MountStatic = (entries: Entry[], siteRoot: string): FileRoute[] =>
  entries
    .filter(entry => entry.isFile() && entry.name !== `index.html`)
    .map(({ name }) => ({ name, path: `/${name}`, root: siteRoot }));
