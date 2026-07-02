import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";
import { TypeWriter } from "@snappy/type-writer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AiStreamerProps } from "./AiStreamer";

import { Markdown, Stream } from "../core";
import { AiStreamTheme } from "../themes";

const typeWriterFps = 15;
const streamFps = 60;

export const useAiStreamerState = ({
  onTailBusyChange,
  streaming,
  text,
  theme: themeKey,
  typeWriterSpeed,
}: AiStreamerProps) => {
  const theme = AiStreamTheme[themeKey];
  const typeWriter = typeWriterSpeed !== undefined;
  const frameMs = _.second / (typeWriter ? typeWriterFps : streamFps);
  const [renderText, setRenderText] = useState(text);
  const [playStep, setPlayStep] = useState(0);
  const [codeHtml, setCodeHtml] = useState(``);
  const [pushing, setPushing] = useState(false);
  const [playedHtml, setPlayedHtml] = useState(``);
  const latestRef = useRef(text);
  const paintRef = useRef(0);
  const paintAtRef = useRef(0);
  const twRef = useRef<TypeWriter | undefined>(undefined);

  latestRef.current = text;

  useEffect(() => {
    if (!streaming) {
      cancelAnimationFrame(paintRef.current);
      paintRef.current = 0;
      paintAtRef.current = 0;
      setRenderText(text);

      return undefined;
    }

    const paint = (now: number) => {
      paintRef.current = 0;
      const gap = paintAtRef.current === 0 ? frameMs : now - paintAtRef.current;
      if (gap < frameMs) {
        paintRef.current = requestAnimationFrame(paint);

        return;
      }
      paintAtRef.current = now;
      setRenderText(value => (value === latestRef.current ? value : latestRef.current));
    };

    paintRef.current = requestAnimationFrame(paint);

    return () => {
      cancelAnimationFrame(paintRef.current);
      paintRef.current = 0;
    };
  }, [frameMs, streaming, text]);

  const pieces = useMemo(() => {
    const parsed = Markdown.pieces(renderText);

    return streaming ? Stream.apply(parsed, Stream.fenceOpen(renderText)) : parsed;
  }, [streaming, renderText]);

  const { doc, segments } = useMemo(() => Stream.annotate(pieces), [pieces]);
  const end = Math.max(0, segments.length - 1);
  const playIndex = typeWriter ? Math.min(playStep, end) : end;
  const waitingHost = streaming && typeWriter && segments.length === 0;
  const tail = segments[playIndex];

  const tailHtml = useMemo(() => {
    const html = tail?.kind === `code` && codeHtml === `` ? `` : Stream.tailHtml(tail, codeHtml);

    return html === `` ? `` : Html.sanitize(html);
  }, [codeHtml, tail]);

  const tailPending = tail !== undefined && (tailHtml === `` || tailHtml !== playedHtml);
  const tailPlaying = streaming && typeWriter && (pushing || playStep < end || tailPending);

  if (streaming && typeWriter && twRef.current === undefined) {
    twRef.current = TypeWriter();
  }

  useEffect(() => {
    onTailBusyChange?.(tailPlaying);
  }, [onTailBusyChange, tailPlaying]);

  useEffect(() => {
    twRef.current?.setWaiting(streaming && typeWriter);
  }, [streaming, typeWriter]);

  useEffect(() => {
    if (streaming && text === ``) {
      setPlayStep(0);
      setPlayedHtml(``);
    }
  }, [streaming, text]);

  useEffect(() => {
    const tw = twRef.current;
    const speed = typeWriterSpeed;
    if (!streaming || speed === undefined || tw === undefined) {
      return undefined;
    }
    tw.setSpeed(speed);

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
    if (!streaming || !typeWriter) {
      return undefined;
    }

    const tw = twRef.current;
    if (tw === undefined || tailHtml === ``) {
      return undefined;
    }

    let dead = false;
    setPushing(true);

    void tw.push(tailHtml).then(finished => {
      if (dead) {
        return finished;
      }

      setPushing(false);

      if (!finished) {
        return finished;
      }

      setPlayedHtml(tailHtml);

      if (playStep < end && !(segments[playStep]?.kind === `code` && codeHtml === ``)) {
        setPlayStep(step => step + 1);
      }

      return finished;
    });

    return () => {
      dead = true;
      setPushing(false);
    };
  }, [codeHtml, doc, end, playStep, segments, streaming, tailHtml, typeWriter]);

  const pushTailHtml = useCallback((html: string) => {
    setCodeHtml(html);
  }, []);

  const attach = useCallback((host: HTMLDivElement | null) => {
    if (host !== null) {
      twRef.current?.attach(host);
    }
  }, []);

  const tailHost = streaming && typeWriter ? attach : undefined;

  return { doc, playIndex, pushTailHtml, streaming, tailHost, theme, typeWriterSpeed, waitingHost };
};
