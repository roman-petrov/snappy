import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";
import { TypeWriter } from "@snappy/type-writer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AiStreamerProps } from "./AiStreamer";

import { Markdown, Stream } from "../core";
import { AiStreamTheme } from "../themes";

const streamFps = 60;
const frameMs = _.second / streamFps;

export const useAiStreamerState = ({
  onTailBusyChange,
  streaming,
  text,
  theme: themeKey,
  typeWriterSpeed,
}: AiStreamerProps) => {
  const theme = AiStreamTheme[themeKey];
  const typeWriter = typeWriterSpeed !== undefined;
  const [renderText, setRenderText] = useState(text);
  const [playStep, setPlayStep] = useState(0);
  const [codeHtml, setCodeHtml] = useState(``);
  const [pushing, setPushing] = useState(false);
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
  }, [streaming, text]);

  const pieces = useMemo(() => {
    const parsed = Markdown.pieces(renderText);

    return streaming ? Stream.apply(parsed, Stream.fenceOpen(renderText)) : parsed;
  }, [streaming, renderText]);

  const { doc, segments } = useMemo(() => Stream.annotate(pieces), [pieces]);
  const end = Math.max(0, segments.length - 1);
  const playIndex = typeWriter ? Math.min(playStep, end) : end;
  const waitingHost = streaming && typeWriter && segments.length === 0;
  const tailPlaying = streaming && typeWriter && (pushing || playStep < end);

  if (streaming && typeWriter && twRef.current === undefined) {
    twRef.current = TypeWriter();
  }

  useEffect(() => {
    onTailBusyChange?.(tailPlaying);
  }, [onTailBusyChange, tailPlaying]);

  useEffect(() => {
    twRef.current?.setWaiting(waitingHost);
  }, [waitingHost]);

  useEffect(() => {
    if (streaming && text === ``) {
      setPlayStep(0);
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
    if (tw === undefined) {
      return undefined;
    }

    const segment = segments[playIndex];
    const html = segment?.kind === `code` && codeHtml === `` ? `` : Stream.tailHtml(segment, codeHtml);

    if (html === ``) {
      return undefined;
    }

    let dead = false;
    setPushing(true);

    void tw.push(Html.sanitize(html)).then(finished => {
      if (dead) {
        return finished;
      }

      setPushing(false);

      if (!finished) {
        return finished;
      }

      if (playStep < end && !(segments[playStep]?.kind === `code` && codeHtml === ``)) {
        setPlayStep(step => step + 1);
      }

      return finished;
    });

    return () => {
      dead = true;
      setPushing(false);
    };
  }, [codeHtml, doc, end, playIndex, playStep, segments, streaming, typeWriter]);

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
