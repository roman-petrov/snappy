/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { Shiki } from "./Shiki";

export type Code = ReturnType<typeof Code>;

export type CodeInput = { lang?: string; source: string; theme: string };

export const Code = () => {
  const inflight = new Map<string, Promise<string>>();
  const key = ({ lang = `text`, source, theme }: CodeInput) => `${theme}::${lang}::${source}`;

  const highlight = async ({ lang = `text`, source, theme }: CodeInput, entry: string) => {
    const { codeToHtml } = await Shiki.load();
    const raw = await codeToHtml(source, { lang, theme });
    inflight.delete(entry);

    return raw;
  };

  return async ({ lang = `text`, source, theme }: CodeInput) => {
    const entry = key({ lang, source, theme });
    const running = inflight.get(entry);
    if (running !== undefined) {
      return running;
    }

    const pending = highlight({ lang, source, theme }, entry);
    inflight.set(entry, pending);

    return pending;
  };
};
