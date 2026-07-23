import { Html } from "@snappy/browser";
import { useCallback, useLayoutEffect, useRef } from "react";

import type { StreamHtmlProps } from "./StreamHtml";

import { CodeStream } from "../core";

export const useStreamHtmlState = ({ cn, html, tailHostRef }: StreamHtmlProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const preserved = useRef(false);
  const tail = tailHostRef !== undefined;

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node;
      if (typeof tailHostRef === `function`) {
        tailHostRef(node);
      }
    },
    [tailHostRef],
  );

  useLayoutEffect(() => {
    if (tail) {
      preserved.current = false;

      return;
    }

    const node = nodeRef.current;
    if (node === null) {
      return;
    }

    if (CodeStream.isShikiHtml(html)) {
      node.innerHTML = Html.sanitize(html);
      preserved.current = true;

      return;
    }

    if (node.querySelector(`pre`) !== null || preserved.current) {
      preserved.current = true;

      return;
    }

    node.innerHTML = html === `` ? `` : Html.sanitize(html);
  }, [html, tail]);

  return { cn, ref };
};
