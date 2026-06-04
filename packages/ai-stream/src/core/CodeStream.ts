/* eslint-disable unicorn/no-array-reduce */
import { _ } from "@snappy/core";

export type TokenChunk = { content: string };

type RequestKeyInput = { closed?: boolean; lang?: string; source: string; theme: string };

type Session = { lang: string; lastSource: string; theme: string };

const escapeHtml = (text: string) => text.replaceAll(`&`, `&amp;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`);

const tokenSpan = (content: string, style: string) =>
  style === `` ? escapeHtml(content) : `<span style="${style}">${escapeHtml(content)}</span>`;

const lines = <T extends TokenChunk>(
  stable: readonly T[],
  closeStable: readonly T[] = [],
  unstable: readonly T[] = [],
) => {
  const flat = [...stable, ...closeStable, ...unstable];

  const { current, lines: rows } = flat.reduce<{ current: T[]; lines: T[][] }>(
    (accumulator, token) =>
      token.content === `\n`
        ? { current: [], lines: [...accumulator.lines, accumulator.current] }
        : { current: [...accumulator.current, token], lines: accumulator.lines },
    { current: [], lines: [] },
  );

  const merged = current.length === 0 ? rows : [...rows, current];

  return merged.at(-1)?.length === 0 ? merged.slice(0, -1) : merged;
};

const lineBody = <T extends TokenChunk>(tokenLines: readonly T[][], span: (token: T) => string) =>
  tokenLines.map(line => `<span class="line">${line.map(span).join(``)}</span>`).join(`\n`);

const preStyle = (bg: unknown, fg: unknown) =>
  _.isString(bg) && _.isString(fg) ? `background-color:${bg};color:${fg}` : ``;

const preWrap = (themeName: string, rootStyle: string, body: string) =>
  `<pre class="shiki ${themeName}" style="${rootStyle}" tabindex="0"><code>${body}</code></pre>`;

const streamBody = <T extends TokenChunk>(
  stable: readonly T[],
  span: (token: T) => string,
  chunk: string,
  fg: string,
) => {
  const stableBody = lineBody(lines(stable), span);
  if (chunk === ``) {
    return stableBody;
  }

  const tail = `<span class="line"><span style="color:${fg}">${escapeHtml(chunk)}</span></span>`;

  return `${stableBody}${stableBody === `` ? `` : `\n`}${tail}`;
};

const finalizeBody = <T extends TokenChunk>(
  stable: readonly T[],
  closeStable: readonly T[],
  unstable: readonly T[],
  span: (token: T) => string,
) => lineBody(lines(stable, closeStable, unstable), span);

const sessionKey = (lang: string, theme: string) => `${theme}::${lang}`;

const requestKey = ({ closed = false, lang = `text`, source, theme }: RequestKeyInput) =>
  `${theme}::${lang}::${closed}::${source}`;

const sourceDelta = (lastSource: string, source: string) => source.slice(lastSource.length);

const sessionReset = (session: Session, lang: string, theme: string, source: string) =>
  sessionKey(session.lang, session.theme) !== sessionKey(lang, theme) || !source.startsWith(session.lastSource);

export const CodeStream = {
  finalizeBody,
  preStyle,
  preWrap,
  requestKey,
  sessionKey,
  sessionReset,
  sourceDelta,
  streamBody,
  tokenSpan,
};
