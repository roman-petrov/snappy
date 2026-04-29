import { _, Timer } from "@snappy/core";
import { useEffect, useRef, useState } from "react";

import type { StreamingTextProps } from "./StreamingText";

import { useAsyncEffect } from "../hooks";

const minCharMs = 8;
const maxCharMs = 24;
const defaultCharMs = 13;
const idleMs = 12;
const smoothing = 0.18;
const maxCharStepMs = 2;
const minChunkGapMs = 1;
const maxCharsPerSecond = _.second / minCharMs;

export const useStreamingTextState = ({ chunks, typography }: StreamingTextProps) => {
  const [text, setText] = useState(``);
  const [streaming, setStreaming] = useState(true);
  const runIdRef = useRef(0);

  useEffect(() => {
    runIdRef.current += 1;

    return () => {
      runIdRef.current += 1;
    };
  }, [chunks]);

  useAsyncEffect(async () => {
    const runId = runIdRef.current;
    let pending = ``;
    let done = false;
    let charMs = defaultCharMs;
    let charsPerSecond = _.second / defaultCharMs;
    let lastChunkAt = 0;

    setText(``);
    setStreaming(true);

    const active = () => runIdRef.current === runId;

    const stream = async () => {
      for await (const chunk of chunks) {
        if (!active()) {
          break;
        }

        if (chunk !== ``) {
          const now = _.now();
          if (lastChunkAt !== 0) {
            const gapMs = Math.max(now - lastChunkAt, minChunkGapMs);
            const instantCharsPerSecond = chunk.length / (gapMs / _.second);
            const safeCharsPerSecond = Math.min(Math.max(instantCharsPerSecond, 1), maxCharsPerSecond);
            charsPerSecond += (safeCharsPerSecond - charsPerSecond) * smoothing;
            const nextCharMs = Math.max(minCharMs, Math.min(maxCharMs, Math.round(_.second / charsPerSecond)));
            const delta = nextCharMs - charMs;
            const step = Math.max(-maxCharStepMs, Math.min(maxCharStepMs, delta));
            charMs += step;
          }
          lastChunkAt = now;
          pending += chunk;
        }
      }

      done = true;
    };

    const print = async () => {
      let value = ``;

      for (;;) {
        if (!active() || (done && pending === ``)) {
          break;
        }

        if (pending !== ``) {
          value += pending[0] ?? ``;
          pending = pending.slice(1);
          setText(value);
          await Timer.sleep(charMs);
        } else if (done) {
          break;
        } else {
          await Timer.sleep(idleMs);
        }
      }
    };

    await Promise.all([stream(), print()]);
    if (!active()) {
      return;
    }

    setStreaming(false);
  }, [chunks]);

  return { streaming, text, typography };
};
