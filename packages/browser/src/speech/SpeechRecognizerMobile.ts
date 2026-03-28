/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
import { Timer } from "@snappy/core";

import type { SpeechRecognizer } from "./Types";

export const SpeechRecognizerMobile: SpeechRecognizer = recognition => options => {
  let accumulatedFinals = ``;
  let lastInterim = ``;
  let previousResultWasFinalOnly = false;
  let stopRequested = false;
  let running = false;
  const pending: { promise?: Promise<void>; resolve?: () => void } = {};

  const concatTranscripts = (...parts: string[]) =>
    parts
      .map(part => part.trim())
      .filter(Boolean)
      .join(` `);

  const mergeOverlap = (base: string, extra: string) => {
    if (base === `` || extra === ``) {
      return concatTranscripts(base, extra);
    }
    const normalizedBase = base.toLowerCase();
    const normalizedExtra = extra.toLowerCase();
    const maxOverlap = Math.min(normalizedBase.length, normalizedExtra.length);
    for (let size = maxOverlap; size > 0; size--) {
      if (normalizedBase.slice(-size) === normalizedExtra.slice(0, size)) {
        return `${base}${extra.slice(size)}`.trim();
      }
    }

    return concatTranscripts(base, extra);
  };
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = options.lang === `ru` ? `ru-RU` : `en-US`;
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const currentIndex = event.resultIndex;
    let interim = ``;
    let finalChunk = ``;
    for (let index = currentIndex; index < event.results.length; index++) {
      const item = event.results[index];
      const piece = item?.[0]?.transcript ?? ``;
      const confidence = item?.[0]?.confidence ?? 0;
      if (item?.isFinal === true && confidence > 0) {
        finalChunk = concatTranscripts(finalChunk, piece);
      } else {
        interim = concatTranscripts(interim, piece);
      }
    }
    if (interim === `` && finalChunk !== ``) {
      if (previousResultWasFinalOnly) {
        return;
      }
      previousResultWasFinalOnly = true;
    } else {
      previousResultWasFinalOnly = false;
    }
    accumulatedFinals = concatTranscripts(accumulatedFinals, finalChunk);
    lastInterim = interim;
    options.onText(concatTranscripts(accumulatedFinals, interim));
  };
  recognition.onstart = () => {
    running = true;
  };
  recognition.onend = () => {
    running = false;
    if (stopRequested) {
      stopRequested = false;
      pending.resolve?.();
      pending.resolve = undefined;
      pending.promise = undefined;

      return;
    }
    if (lastInterim !== ``) {
      accumulatedFinals = mergeOverlap(accumulatedFinals, lastInterim);
      lastInterim = ``;
      options.onText(accumulatedFinals);
    }
    Timer.timeout(() => {
      if (!running && !stopRequested) {
        recognition.start();
      }
    });
  };
  recognition.start();

  return async () => {
    if (pending.promise !== undefined) {
      return pending.promise;
    }
    pending.promise = new Promise(resolve => {
      pending.resolve = resolve;
      stopRequested = true;
      if (running) {
        recognition.stop();
      } else {
        stopRequested = false;
        pending.resolve = undefined;
        pending.promise = undefined;
        resolve();
      }
    });

    return pending.promise;
  };
};
