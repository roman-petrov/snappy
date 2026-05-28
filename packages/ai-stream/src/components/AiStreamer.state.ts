import { _ } from "@snappy/core";
import { TypeWriter } from "@snappy/type-writer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AiStreamerProps } from "./AiStreamer";

import { Markdown, Stream } from "../core";
import { AiStreamTheme } from "../themes";

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
  const throttle = streaming && !typeWriter;
  const frameMs = _.second / streamFps;
  const [renderText, setRenderText] = useState(text);
  const [twBusy, setTwBusy] = useState(false);
  const latestRef = useRef(text);
  const rafRef = useRef(0);
  const lastPaintRef = useRef(0);

  const syncRenderText = useCallback(
    (next: string) => {
      setRenderText(previous => (previous === next ? previous : next));
    },
    [setRenderText],
  );

  latestRef.current = text;

  useEffect(() => {
    if (streaming && typeWriter) {
      return undefined;
    }

    if (!throttle) {
      if (rafRef.current !== 0) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      lastPaintRef.current = 0;
      syncRenderText(text);

      return undefined;
    }

    const paint = (now: number) => {
      rafRef.current = 0;
      const elapsed = lastPaintRef.current === 0 ? frameMs : now - lastPaintRef.current;
      if (elapsed >= frameMs) {
        lastPaintRef.current = now;
        syncRenderText(latestRef.current);

        return;
      }

      rafRef.current = requestAnimationFrame(paint);
    };

    const schedule = () => {
      if (rafRef.current !== 0) {
        return;
      }
      rafRef.current = requestAnimationFrame(paint);
    };

    schedule();

    return () => {
      if (rafRef.current !== 0) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [frameMs, streaming, syncRenderText, text, throttle, typeWriter]);

  useEffect(() => {
    if (!streaming || !typeWriter || twBusy) {
      return;
    }

    syncRenderText(latestRef.current);
  }, [streaming, syncRenderText, text, twBusy, typeWriter]);

  const pieces = useMemo(() => {
    const parsed = Markdown.pieces(renderText);

    return streaming ? Stream.apply(parsed) : parsed;
  }, [streaming, renderText]);

  const { doc, segments } = useMemo(() => Stream.annotate(pieces), [pieces]);
  const streamEnd = Math.max(0, segments.length - 1);
  const twRef = useRef<TypeWriter | undefined>(undefined);

  if (streaming && typeWriter && twRef.current === undefined) {
    twRef.current = TypeWriter();
  }

  const [playIndexStep, setPlayIndexStep] = useState(0);
  const codeHtmlRef = useRef(``);
  const playIndex = typeWriter ? Math.min(playIndexStep, streamEnd) : streamEnd;

  useEffect(() => {
    if (text !== `` && streaming) {
      return;
    }

    setPlayIndexStep(0);
  }, [streaming, text]);

  useEffect(() => {
    const tw = twRef.current;
    const speed = typeWriterSpeed;
    if (!streaming || !typeWriter || tw === undefined || speed === undefined) {
      return undefined;
    }
    tw.speed = speed;

    return tw.subscribe(setTwBusy);
  }, [streaming, typeWriter, typeWriterSpeed]);

  const tailPlaying = streaming && typeWriter && (twBusy || playIndexStep < streamEnd);

  useEffect(() => {
    onTailBusyChange?.(tailPlaying);
  }, [tailPlaying, onTailBusyChange]);

  useEffect(
    () => () => {
      twRef.current?.destroy();
      twRef.current = undefined;
    },
    [],
  );

  const syncTail = useCallback(() => {
    const tw = twRef.current;
    if (tw === undefined) {
      return;
    }

    const segment = segments[playIndex];

    const html =
      segment?.kind === `code` && codeHtmlRef.current === `` ? `` : Stream.tailHtml(segment, codeHtmlRef.current);
    tw.push(html);
  }, [playIndex, segments]);

  useEffect(() => {
    if (!typeWriter) {
      return;
    }
    syncTail();
  }, [doc, syncTail, typeWriter]);

  useEffect(() => {
    if (segments[playIndex]?.kind !== `code`) {
      codeHtmlRef.current = ``;
    }
  }, [playIndex, segments]);

  useEffect(() => {
    const canAdvance =
      typeWriter &&
      streaming &&
      !twBusy &&
      playIndexStep < streamEnd &&
      !(segments[playIndexStep]?.kind === `code` && codeHtmlRef.current === ``);

    if (!canAdvance) {
      return;
    }

    setPlayIndexStep(index => index + 1);
  }, [streaming, twBusy, playIndexStep, streamEnd, segments, typeWriter]);

  const pushTailHtml = useCallback(
    (html: string) => {
      codeHtmlRef.current = html;
      syncTail();
    },
    [syncTail],
  );

  const waitingHost = streaming && typeWriter && segments.length === 0;

  if (twRef.current !== undefined) {
    twRef.current.waiting = waitingHost;
  }

  const attachTailHost = useCallback(
    (host: HTMLDivElement | null) => {
      const tw = twRef.current;
      if (tw === undefined || host === null) {
        return;
      }

      tw.attach(host);
      syncTail();
    },
    [syncTail],
  );

  const tailHost = streaming && typeWriter ? attachTailHost : undefined;

  return { doc, playIndex, pushTailHtml, streaming, tailHost, theme, typeWriterSpeed, waitingHost };
};
