/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { codeToHtml } from "shiki";

export type Code = ReturnType<typeof Code>;

export type CodeInput = { lang?: string; source: string; theme: string };

export const Code = () => {
  const inflight = new Map<string, Promise<string>>();
  const key = ({ lang = `text`, source, theme }: CodeInput) => `${theme}::${lang}::${source}`;

  return async ({ lang = `text`, source, theme }: CodeInput) => {
    const entry = key({ lang, source, theme });
    const running = inflight.get(entry);
    if (running !== undefined) {
      return running;
    }

    const pending = codeToHtml(source, { lang, theme }).then(raw => {
      inflight.delete(entry);

      return raw;
    });

    inflight.set(entry, pending);

    return pending;
  };
};
