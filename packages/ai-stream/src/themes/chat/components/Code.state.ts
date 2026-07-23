/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable require-atomic-updates */
import { Html } from "@snappy/browser";
import { Copy } from "@snappy/platform";
import { useStoreValue } from "@snappy/store";
import { $theme, Theme } from "@snappy/ui";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Code, type CodeInput, CodeStream, type CodeViewProps } from "../../../core";

const code = Code();
const safeCodeHtml = async (input: CodeInput) => Html.sanitize(await code(input));
const { isShikiHtml } = CodeStream;

export const useCodeState = ({ onTailHtml, piece, tailHostRef }: CodeViewProps) => {
  const { closed, html: seedHtml, lang, source } = piece;
  const theme = useStoreValue($theme);
  const themeName = Theme.effective(theme) === `dark` ? `dark-plus` : `light-plus`;
  const [html, setHtml] = useState(seedHtml);
  const htmlRef = useRef(html);
  htmlRef.current = html;
  const paintedRef = useRef(``);
  const tail = tailHostRef !== undefined && onTailHtml !== undefined;
  const paintKey = `${lang}\0${source}\0${themeName}\0${closed}`;

  useLayoutEffect(() => {
    if (tail || seedHtml === `` || htmlRef.current === seedHtml) {
      return;
    }
    if (isShikiHtml(seedHtml) || !isShikiHtml(htmlRef.current)) {
      setHtml(seedHtml);
    }
  }, [seedHtml, tail]);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const key = paintKey;
      if (!tail && closed && isShikiHtml(htmlRef.current) && paintedRef.current === key) {
        return;
      }

      const safe = await safeCodeHtml({ closed, lang, source, theme: themeName });

      if (!alive) {
        return;
      }
      paintedRef.current = key;
      if (tail) {
        if (source.trim() !== ``) {
          onTailHtml(safe);
        }
      } else if (safe !== ``) {
        setHtml(safe);
      }
    };

    void run();

    return () => {
      alive = false;
    };
  }, [onTailHtml, paintKey, tail]);

  const copy = async () => Copy.html(await safeCodeHtml({ closed: true, lang, source, theme: themeName }));
  const copyable = closed || tailHostRef === undefined;
  const resolvedHtml = html !== `` || tail ? html : seedHtml;

  return { copy, copyable, html: resolvedHtml, tailHostRef };
};
