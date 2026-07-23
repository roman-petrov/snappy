import { Html } from "@snappy/browser";
import { TypeWriter } from "@snappy/type-writer";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { AiStreamerProps } from "./AiStreamer";

import { type AnnotatedDocument, Markdown, Stream } from "../core";
import { AiStreamTheme } from "../themes";

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
  const [pushing, setPushing] = useState(false);
  const [playedHtml, setPlayedHtml] = useState(``);
  const [sealedDoc, setSealedDoc] = useState<AnnotatedDocument>([]);
  const previousTextRef = useRef(text);
  const twRef = useRef<TypeWriter | undefined>(undefined);
  const resetPlayback = streaming && !text.startsWith(previousTextRef.current);

  useLayoutEffect(() => {
    if (!resetPlayback) {
      return;
    }

    setSealedDoc([]);
    setPlayStep(0);
    setPlayedHtml(``);
  }, [resetPlayback]);

  useEffect(() => {
    previousTextRef.current = text;
  }, [text]);

  const pieces = useMemo(() => {
    const parsed = Markdown.pieces(text);

    return streaming ? Stream.apply(parsed, Stream.fenceOpen(text)) : parsed;
  }, [streaming, text]);

  const { doc, segments } = useMemo(() => Stream.annotate(pieces), [pieces]);
  const end = Math.max(0, segments.length - 1);
  const playHead = resetPlayback ? 0 : playStep;
  const playIndex = animated ? Math.min(playHead, end) : end;
  const waitingHost = streaming && segments.length === 0;
  const tail = segments[playIndex];
  const sealAt = streaming ? Stream.sealCount(doc, playIndex) : doc.length;
  const effectiveSealed = resetPlayback ? [] : sealedDoc;
  const liveDoc = useMemo(() => doc.slice(effectiveSealed.length), [doc, effectiveSealed.length]);

  useEffect(() => {
    if (resetPlayback) {
      return;
    }

    setSealedDoc(previous => {
      if (previous.length === sealAt) {
        return previous;
      }
      if (previous.length > sealAt) {
        return previous.slice(0, sealAt);
      }

      return [...previous, ...doc.slice(previous.length, sealAt)];
    });
  }, [doc, resetPlayback, sealAt]);

  const tailHtml = useMemo(() => {
    const html = Stream.tailHtml(tail, codeHtml);

    return html === `` ? `` : Html.sanitize(html);
  }, [codeHtml, tail]);

  const tailPending = tail !== undefined && (tailHtml === `` || tailHtml !== playedHtml);
  const tailPlaying = streaming && (tailPending || (animated && (pushing || playStep < end)));

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
    setCodeHtml(``);
  }, [playIndex]);

  useEffect(() => {
    if (!streaming) {
      return undefined;
    }

    const tw = twRef.current;
    if (tw === undefined || tailHtml === ``) {
      return undefined;
    }

    let dead = false;

    if (animated) {
      setPushing(true);
    }

    void tw.push(tailHtml).then(finished => {
      if (dead) {
        return finished;
      }

      if (animated) {
        setPushing(false);
      }

      if (!finished) {
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

      if (animated) {
        setPushing(false);
      }
    };
  }, [animated, codeHtml, end, playStep, segments, streaming, tailHtml]);

  const pushTailHtml = useCallback((html: string) => {
    setCodeHtml(html);
  }, []);

  const attach = useCallback((host: HTMLDivElement | null) => {
    if (host !== null) {
      twRef.current?.attach(host);
    }
  }, []);

  const tailHost = streaming ? attach : undefined;

  return {
    liveDoc,
    playIndex,
    pushTailHtml,
    sealedDoc: effectiveSealed,
    streaming,
    tailHost,
    theme,
    typeWriterSpeed,
    waitingHost,
  };
};
