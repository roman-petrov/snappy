/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { ShikiStreamTokenizer } from "@shikijs/stream";
import {
  type BundledLanguage,
  bundledLanguages,
  createHighlighter,
  createJavaScriptRegexEngine,
  getTokenStyleObject,
  stringifyTokenStyle,
  type ThemedToken,
} from "shiki";

import { CodeStream } from "./CodeStream";

export type Code = ReturnType<typeof Code>;

export type CodeInput = { closed?: boolean; lang?: string; source: string; theme: string };

const highlighterPromise = createHighlighter({
  engine: createJavaScriptRegexEngine(),
  langs: [`text`],
  themes: [`dark-plus`, `light-plus`],
});

export const Code = () => {
  type Active = { lang: string; lastSource: string; theme: string; tokenizer: ShikiStreamTokenizer };

  type Highlighter = Awaited<typeof highlighterPromise>;

  const inflight = new Map<string, Promise<string>>();
  let active: Active | undefined;

  const resolveLang = async (lang: string) => {
    const highlighter = await highlighterPromise;

    if (highlighter.getLoadedLanguages().includes(lang)) {
      return lang;
    }

    if (!(lang in bundledLanguages)) {
      return `text`;
    }

    await highlighter.loadLanguage(lang as BundledLanguage);

    return lang;
  };

  const span = (token: ThemedToken) => {
    const style = stringifyTokenStyle(token.htmlStyle ?? getTokenStyleObject(token));

    return CodeStream.tokenSpan(token.content, style);
  };

  const themeRoot = (highlighter: Highlighter, theme: string) => {
    const { bg, fg } = highlighter.getTheme(theme);

    return { fg, rootStyle: CodeStream.preStyle(bg, fg) };
  };

  const dropActive = () => {
    active = undefined;
  };

  const highlight = async ({ closed = false, lang = `text`, source, theme }: CodeInput) => {
    const resolvedLang = await resolveLang(lang);
    const highlighter = await highlighterPromise;
    const key = CodeStream.sessionKey(resolvedLang, theme);
    const { fg, rootStyle } = themeRoot(highlighter, theme);

    if (active !== undefined && CodeStream.sessionReset(active, resolvedLang, theme, source)) {
      active.tokenizer.clear();
      dropActive();
    }

    if (closed) {
      if (active !== undefined && CodeStream.sessionKey(active.lang, active.theme) === key) {
        const delta = CodeStream.sourceDelta(active.lastSource, source);
        if (delta !== ``) {
          await active.tokenizer.enqueue(delta);
        }

        const { stable: closeStable } = active.tokenizer.close();

        const body = CodeStream.finalizeBody(
          active.tokenizer.tokensStable,
          closeStable,
          active.tokenizer.tokensUnstable,
          span,
        );
        dropActive();

        return CodeStream.preWrap(theme, rootStyle, body);
      }

      const tokenizer = new ShikiStreamTokenizer({ highlighter, lang: resolvedLang, theme });
      await tokenizer.enqueue(source);
      const { stable: closeStable } = tokenizer.close();
      const body = CodeStream.finalizeBody(tokenizer.tokensStable, closeStable, tokenizer.tokensUnstable, span);

      return CodeStream.preWrap(theme, rootStyle, body);
    }

    if (active === undefined || CodeStream.sessionKey(active.lang, active.theme) !== key) {
      active = {
        lang: resolvedLang,
        lastSource: ``,
        theme,
        tokenizer: new ShikiStreamTokenizer({ highlighter, lang: resolvedLang, theme }),
      };
    }

    const session = active;
    const delta = CodeStream.sourceDelta(session.lastSource, source);
    if (delta !== ``) {
      await session.tokenizer.enqueue(delta);
    }

    session.lastSource = source;

    const body = CodeStream.streamBody(
      session.tokenizer.tokensStable,
      span,
      session.tokenizer.lastUnstableCodeChunk,
      fg,
    );

    return CodeStream.preWrap(theme, rootStyle, body);
  };

  const request = async (input: CodeInput) => {
    const entry = CodeStream.requestKey(input);
    const running = inflight.get(entry);
    if (running !== undefined) {
      return running;
    }

    const pending = highlight(input).finally(() => {
      inflight.delete(entry);
    });

    inflight.set(entry, pending);

    return pending;
  };

  return request;
};
