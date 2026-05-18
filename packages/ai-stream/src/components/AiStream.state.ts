import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";
import { Marked } from "marked";
import { useEffect, useMemo, useState } from "react";
import remend from "remend";

import type { AiStreamProps } from "./AiStream";

export const useAiStreamState = ({ color, onHtml, stream, typography }: AiStreamProps) => {
  const parser = useMemo(() => new Marked({ async: false, breaks: true, gfm: true }), []);
  const [text, setText] = useState(() => (_.isString(stream) ? stream : ``));
  const [streaming, setStreaming] = useState(() => !_.isString(stream));

  useEffect(() => {
    if (_.isString(stream)) {
      setText(stream);
      setStreaming(false);

      return _.noop;
    }

    let alive = true;

    setText(``);
    setStreaming(true);

    const run = async () => {
      try {
        for await (const chunk of stream) {
          if (!alive || chunk === ``) {
            continue;
          }
          setText(previous => previous + chunk);
        }
      } finally {
        if (alive) {
          setStreaming(false);
        }
      }
    };

    void run();

    return () => {
      alive = false;
    };
  }, [stream]);

  const html = useMemo(
    () =>
      parser.parse(
        streaming
          ? remend(text, {
              bold: true,
              boldItalic: true,
              images: false,
              inlineCode: false,
              italic: true,
              links: false,
              strikethrough: false,
            })
          : text,
        { async: false },
      ),
    [parser, streaming, text],
  );

  useEffect(() => {
    onHtml?.(Html.sanitize(html));
  }, [html, onHtml]);

  return { color, html, streaming, typography };
};
