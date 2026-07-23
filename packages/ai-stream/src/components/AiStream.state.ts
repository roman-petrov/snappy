/* eslint-disable unicorn/try-complexity */
import type { AiChatCompletionSession } from "@snappy/ai";

import { _ } from "@snappy/core";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AiStreamProps } from "./AiStream";

type Pump = { buffer: string; iterable: AsyncIterable<string>; networkDone: boolean; started: boolean };

export const useAiStreamState = ({
  active = false,
  chatModel,
  generationKey = 0,
  messages: chatMessages,
  onComplete,
  stream: externalStream,
  theme,
  typeWriterSpeed,
}: AiStreamProps) => {
  const sessionRef = useRef<AiChatCompletionSession | undefined>(undefined);
  const generationRef = useRef(generationKey);
  const pumpRef = useRef<Pump | undefined>(undefined);
  const mountedRef = useRef(false);
  const doneRef = useRef(false);
  const flushRafRef = useRef(0);
  const generating = active && chatModel !== undefined && chatMessages !== undefined && chatMessages.length > 0;

  if (generating && (sessionRef.current === undefined || generationRef.current !== generationKey)) {
    generationRef.current = generationKey;
    const session = chatModel.completions({ messages: chatMessages });
    sessionRef.current = session;
    pumpRef.current = { buffer: ``, iterable: session.chatText(), networkDone: false, started: false };
  }

  if (!generating && externalStream === undefined) {
    sessionRef.current = undefined;
  }

  const stream =
    externalStream ?? (generating && sessionRef.current !== undefined ? pumpRef.current?.iterable : undefined);

  if (stream !== undefined && pumpRef.current?.iterable !== stream) {
    pumpRef.current = { buffer: ``, iterable: stream, networkDone: false, started: false };
  }

  const [buffer, setBuffer] = useState(``);
  const [networkDone, setNetworkDone] = useState(stream === undefined);
  const [tailBusy, setTailBusy] = useState(false);
  const streaming = !networkDone || tailBusy;

  const onTailBusyChange = useCallback((next: boolean) => {
    setTailBusy(next);
  }, []);

  const cancelFlush = useCallback(() => {
    if (flushRafRef.current !== 0) {
      cancelAnimationFrame(flushRafRef.current);
      flushRafRef.current = 0;
    }
  }, []);

  const flushBuffer = useCallback(() => {
    cancelFlush();
    const next = pumpRef.current?.buffer;
    if (next !== undefined && mountedRef.current) {
      setBuffer(next);
    }
  }, [cancelFlush]);

  const scheduleFlush = useCallback(() => {
    if (flushRafRef.current !== 0 || !mountedRef.current) {
      return;
    }
    flushRafRef.current = requestAnimationFrame(() => {
      flushRafRef.current = 0;
      const next = pumpRef.current?.buffer;
      if (next !== undefined && mountedRef.current) {
        setBuffer(value => (value === next ? value : next));
      }
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      cancelFlush();
    };
  }, [cancelFlush]);

  useEffect(() => {
    doneRef.current = false;
  }, [generationKey, stream]);

  useEffect(() => {
    if (!generating) {
      return;
    }
    cancelFlush();
    setBuffer(``);
    setNetworkDone(false);
  }, [cancelFlush, generationKey, generating]);

  useEffect(() => {
    if (stream === undefined) {
      return;
    }

    const activePump = pumpRef.current;
    if (activePump === undefined) {
      return;
    }

    setNetworkDone(activePump.networkDone);
    setBuffer(activePump.buffer);

    if (activePump.started) {
      return;
    }

    activePump.started = true;

    void (async () => {
      try {
        for await (const chunk of activePump.iterable) {
          if (!_.isString(chunk) || chunk === ``) {
            continue;
          }
          activePump.buffer += chunk;
          scheduleFlush();
        }
      } finally {
        activePump.networkDone = true;
        flushBuffer();
        if (mountedRef.current) {
          setNetworkDone(true);
        }
      }
    })();
  }, [flushBuffer, scheduleFlush, stream]);

  useEffect(() => {
    if (!networkDone || doneRef.current || onComplete === undefined) {
      return;
    }
    if (tailBusy) {
      return;
    }
    if (pumpRef.current?.started !== true) {
      return;
    }
    doneRef.current = true;
    onComplete(buffer);
  }, [buffer, networkDone, onComplete, tailBusy]);

  return { onTailBusyChange, streaming, text: buffer, theme, typeWriterSpeed };
};
