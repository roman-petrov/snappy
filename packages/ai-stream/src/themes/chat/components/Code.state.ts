import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";
import { useStoreValue } from "@snappy/store";
import { $theme, Theme } from "@snappy/ui";
import { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";

import type { CodeViewProps } from "../../../core/Types";

import { Markdown } from "../../../core/Markdown";

export const useCodeState = ({ onTailHtml, piece, tailHostRef }: CodeViewProps) => {
  const { closed, lang, source } = piece;
  const theme = useStoreValue($theme);

  const fallback = useMemo(
    () => Html.sanitize(Markdown.html(`\`\`\`${lang ?? ``}\n${source}\n\`\`\``)),
    [lang, source],
  );

  const [html, setHtml] = useState(fallback);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const shikiTheme = Theme.effective() === `dark` ? `dark-plus` : `light-plus`;

      try {
        const raw = await codeToHtml(source, { lang: _.isString(lang) ? lang : `text`, theme: shikiTheme });

        if (alive) {
          setHtml(Html.sanitize(raw));
        }
      } catch {
        if (alive) {
          setHtml(fallback);
        }
      }
    };

    void run();

    return () => {
      alive = false;
    };
  }, [fallback, lang, source, theme]);

  useEffect(() => {
    onTailHtml?.(html);
  }, [html, onTailHtml]);

  const copy = async () => navigator.clipboard.writeText(source);

  return { closed, copy, html, tailHostRef };
};
