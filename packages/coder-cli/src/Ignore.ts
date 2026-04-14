import { globby } from "globby";

const ignoreFileExtensions = [
  `.png`,
  `.jpg`,
  `.jpeg`,
  `.gif`,
  `.webp`,
  `.ico`,
  `.bmp`,
  `.tiff`,
  `.avif`,
  `.woff`,
  `.woff2`,
  `.ttf`,
  `.otf`,
  `.eot`,
  `.pdf`,
  `.zip`,
  `.gz`,
  `.tar`,
  `.tgz`,
  `.7z`,
  `.rar`,
  `.jar`,
  `.bin`,
  `.exe`,
  `.dll`,
  `.so`,
  `.dylib`,
  `.class`,
  `.wasm`,
  `.mp3`,
  `.wav`,
  `.flac`,
  `.ogg`,
  `.mp4`,
  `.webm`,
  `.mov`,
  `.avi`,
  `.lock`,
] as const;

const list = async ({ cwd, globs }: { cwd: string; globs?: string[] }) =>
  globby(globs ?? [`**/*`], {
    cwd,
    dot: true,
    followSymbolicLinks: false,
    gitignore: true,
    ignore: [`**/.git/**`, ...ignoreFileExtensions.map(extension => `**/*${extension}`)],
    onlyFiles: true,
  });

export const Ignore = { list };
