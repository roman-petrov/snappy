import { Html } from "@snappy/browser";
import { Copy } from "@snappy/platform";
import { useStoreValue } from "@snappy/store";
import { $theme, Theme } from "@snappy/ui";
import { useEffect, useRef, useState } from "react";

import { Code, type CodeInput, type CodeViewProps } from "../../../core";

const code = Code();
const safeCodeHtml = async (input: CodeInput) => Html.sanitize(await code(input));

export const useCodeState = ({ onTailHtml, piece, tailHostRef }: CodeViewProps) => {
  const { closed, lang, source } = piece;
  const theme = useStoreValue($theme);
  const themeName = Theme.effective() === `dark` ? `dark-plus` : `light-plus`;
  const [html, setHtml] = useState(``);
  const htmlRef = useRef(html);
  htmlRef.current = html;
  const tail = tailHostRef !== undefined && onTailHtml !== undefined;

  useEffect(() => {
    let alive = true;

    const run = async () => {
      if (!tail && closed && htmlRef.current !== ``) {
        return;
      }

      const safe = await safeCodeHtml({ closed, lang, source, theme: themeName });

      if (!alive) {
        return;
      }
      if (tail) {
        onTailHtml(safe);
      } else {
        setHtml(safe);
      }
    };

    void run();

    return () => {
      alive = false;
    };
  }, [closed, lang, onTailHtml, source, tail, theme, themeName]);

  const copy = async () => Copy.html(await safeCodeHtml({ closed: true, lang, source, theme: themeName }));

  return { closed, copy, html, tailHostRef };
};
