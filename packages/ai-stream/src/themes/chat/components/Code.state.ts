import { Html } from "@snappy/browser";
import { Timer } from "@snappy/core";
import { Copy } from "@snappy/platform";
import { useStoreValue } from "@snappy/store";
import { $theme, Theme } from "@snappy/ui";
import { useEffect, useState } from "react";

import { Code, type CodeInput, type CodeViewProps } from "../../../core";

const code = Code();
const safeCodeHtml = async ({ lang, source, theme }: CodeInput) => Html.sanitize(await code({ lang, source, theme }));

export const useCodeState = ({ onTailHtml, piece, tailHostRef }: CodeViewProps) => {
  const debounceMs = 120;
  const { closed, lang, source } = piece;
  const theme = useStoreValue($theme);
  const themeName = Theme.effective() === `dark` ? `dark-plus` : `light-plus`;
  const [html, setHtml] = useState(``);
  const tail = tailHostRef !== undefined && onTailHtml !== undefined;

  useEffect(() => {
    let alive = true;
    if (!tail) {
      setHtml(``);
    }

    const run = async () => {
      const safe = await safeCodeHtml({ lang, source, theme: themeName });

      if (!alive) {
        return;
      }
      if (tail) {
        onTailHtml(safe);
      } else {
        setHtml(safe);
      }
    };

    const stopTimer = Timer.timeout(run, closed ? 0 : debounceMs);

    return () => {
      alive = false;
      stopTimer();
    };
  }, [closed, lang, onTailHtml, source, tail, theme, themeName]);

  const copy = async () => Copy.html(await safeCodeHtml({ lang, source, theme: themeName }));

  return { closed, copy, html, tailHostRef };
};
