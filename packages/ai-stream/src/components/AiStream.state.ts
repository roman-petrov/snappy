import { Ai, type AiChatCompletionSession } from "@snappy/ai";
import { _ } from "@snappy/core";
import { useCallback, useEffect, useRef, useState } from "react";

import type { AiStreamProps } from "./AiStream";

type Pump = { buffer: string; iterable: AsyncIterable<string>; networkDone: boolean; started: boolean };

export const useAiStreamState = ({
  active = false,
  aiOptions,
  generationKey = 0,
  model,
  onComplete,
  prompt = ``,
  stream: externalStream,
  theme,
  typeWriterSpeed,
}: AiStreamProps) => {
  const sessionRef = useRef<AiChatCompletionSession | undefined>(undefined);
  const generationRef = useRef(generationKey);
  const pumpRef = useRef<Pump | undefined>(undefined);
  const mountedRef = useRef(false);
  const doneRef = useRef(false);

  const generating =
    externalStream === undefined && active && aiOptions !== undefined && model !== undefined && prompt.trim() !== ``;

  if (generating && (sessionRef.current === undefined || generationRef.current !== generationKey)) {
    generationRef.current = generationKey;
    const session = Ai(aiOptions).chat.completions.create({ model, prompt, reasoningEffort: `none` });
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

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    doneRef.current = false;
  }, [generationKey, stream]);

  useEffect(() => {
    if (!generating) {
      return;
    }
    setBuffer(``);
    setNetworkDone(false);
  }, [generationKey, generating]);

  useEffect(() => {
    if (stream === undefined) {
      return;
    }

    const activePump = pumpRef.current;
    if (activePump === undefined) {
      return;
    }

    setNetworkDone(activePump.networkDone);
    if (activePump.buffer !== ``) {
      setBuffer(activePump.buffer);
    }

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
          if (mountedRef.current) {
            setBuffer(activePump.buffer);
          }
        }
      } finally {
        activePump.networkDone = true;
        if (mountedRef.current) {
          setNetworkDone(true);
        }
      }
    })();
  }, [stream]);

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
