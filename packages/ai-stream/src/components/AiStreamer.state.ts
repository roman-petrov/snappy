import { Html } from "@snappy/browser";
import { TypeWriter } from "@snappy/type-writer";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { AiStreamerProps } from "./AiStreamer";

import { type AnnotatedDocument, Markdown, Stream } from "../core";
import { AiStreamTheme } from "../themes";

const emptyCodeHtml = new Map<number, string>();

export const useAiStreamerState = ({
  onTailBusyChange,
  streaming,
  text,
  theme: themeKey,
  typeWriterSpeed,
}: AiStreamerProps) => {
  const theme = AiStreamTheme[themeKey];
  const animated = typeWriterSpeed !== undefined;
  const [playStep, setPlayStep] = useState(0);
  const [codeHtml, setCodeHtml] = useState(``);
  const [playedHtml, setPlayedHtml] = useState(``);
  const [sealedDoc, setSealedDoc] = useState<AnnotatedDocument>([]);
  const [codeHtmlByIndex, setCodeHtmlByIndex] = useState(emptyCodeHtml);
  const previousTextRef = useRef(text);
  const twRef = useRef<TypeWriter | undefined>(undefined);
  const playIndexRef = useRef(0);
  const segmentsRef = useRef<ReturnType<typeof Stream.annotate>[`segments`]>([]);
  const resetPlayback = streaming && !text.startsWith(previousTextRef.current);

  useLayoutEffect(() => {
    if (resetPlayback) {
      setSealedDoc([]);
      setPlayStep(0);
      setPlayedHtml(``);
      setCodeHtml(``);
      setCodeHtmlByIndex(emptyCodeHtml);
    }

    previousTextRef.current = text;
  }, [resetPlayback, text]);

  const pieces = useMemo(() => {
    const parsed = Markdown.pieces(text);

    return streaming ? Stream.apply(parsed, Stream.fenceOpen(text)) : parsed;
  }, [streaming, text]);

  const { doc: annotated, segments } = useMemo(() => Stream.annotate(pieces), [pieces]);
  const end = Math.max(0, segments.length - 1);
  const playIndex = animated ? Math.min(resetPlayback ? 0 : playStep, end) : end;
  const waitingHost = streaming && segments.length === 0;
  const tail = segments[playIndex];
  const sealAt = streaming ? Stream.sealCount(annotated, playIndex) : annotated.length;
  const sealed = resetPlayback ? [] : sealedDoc;
  playIndexRef.current = playIndex;
  segmentsRef.current = segments;

  useEffect(() => {
    if (resetPlayback) {
      return;
    }

    setSealedDoc(previous => {
      const at = Math.max(previous.length, sealAt);
      const next = annotated.slice(0, at);

      return previous.length === next.length && previous.every((piece, index) => piece === next[index])
        ? previous
        : next;
    });
  }, [annotated, resetPlayback, sealAt]);

  const doc = [...sealed, ...annotated.slice(sealed.length)];

  const tailHtml = useMemo(() => {
    const html = Stream.tailHtml(tail, codeHtml);

    return html === `` ? `` : Html.sanitize(html);
  }, [codeHtml, tail]);

  const tailPending = tail !== undefined && (tailHtml === `` || tailHtml !== playedHtml);
  const tailPlaying = streaming && (tailPending || (animated && playStep < end));

  if (streaming && twRef.current === undefined) {
    twRef.current = TypeWriter();
  }

  useEffect(() => {
    onTailBusyChange?.(tailPlaying);
  }, [onTailBusyChange, tailPlaying]);

  useEffect(() => {
    twRef.current?.setWaiting(streaming);
  }, [streaming]);

  useEffect(() => {
    const tw = twRef.current;
    if (!streaming || tw === undefined) {
      return undefined;
    }
    tw.setSpeed(typeWriterSpeed ?? `instant`);

    return undefined;
  }, [streaming, typeWriterSpeed]);

  useEffect(
    () => () => {
      twRef.current?.destroy();
      twRef.current = undefined;
    },
    [],
  );

  useEffect(() => {
    if (tail?.kind === `code`) {
      setCodeHtml(codeHtmlByIndex.get(playIndex) ?? ``);

      return;
    }

    setCodeHtml(``);
  }, [codeHtmlByIndex, playIndex, tail?.kind]);

  useEffect(() => {
    if (!streaming) {
      return undefined;
    }

    const tw = twRef.current;
    if (tw === undefined || tailHtml === ``) {
      return undefined;
    }

    let dead = false;

    void tw.push(tailHtml).then(finished => {
      if (dead || !finished) {
        return finished;
      }

      setPlayedHtml(tailHtml);

      if (animated && playStep < end) {
        setPlayStep(step => step + 1);
      }

      return finished;
    });

    return () => {
      dead = true;
    };
  }, [animated, codeHtml, end, playStep, segments, streaming, tailHtml]);

  const pushTailHtml = useCallback((html: string) => {
    const index = playIndexRef.current;
    if (segmentsRef.current[index]?.kind === `code` && html !== ``) {
      setCodeHtmlByIndex(previous => {
        if (previous.get(index) === html) {
          return previous;
        }

        const next = new Map(previous);
        next.set(index, html);

        return next;
      });
    }

    setCodeHtml(html);
  }, []);

  const attach = useCallback((host: HTMLDivElement | null) => {
    if (host !== null) {
      twRef.current?.attach(host);
    }
  }, []);

  const tailHost = streaming ? attach : undefined;

  return { codeHtmlByIndex, doc, playIndex, pushTailHtml, streaming, tailHost, theme, waitingHost };
};
