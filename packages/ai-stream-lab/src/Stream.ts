/* eslint-disable @typescript-eslint/no-misused-spread */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-try-statements */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-use-before-define */
import { Timer } from "@snappy/core";

import type { Profile } from "./Profiles";

const wait = async (ms: number, signal: AbortSignal) => {
  if (ms <= 0) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      cancel();
      reject(new DOMException(`Aborted`, `AbortError`));
    };

    const cancel = Timer.timeout(() => {
      signal.removeEventListener(`abort`, onAbort);
      resolve();
    }, ms);

    if (signal.aborted) {
      onAbort();

      return;
    }

    signal.addEventListener(`abort`, onAbort, { once: true });
  });
};

const cutPoints = (text: string, markers: string[]) => {
  const points = new Set<number>();

  for (const marker of markers) {
    if (marker === ``) {
      continue;
    }

    let from = 0;

    for (;;) {
      const index = text.indexOf(marker, from);

      if (index === -1) {
        break;
      }

      const mid = index + Math.max(1, Math.floor(marker.length / 2));

      points.add(mid);
      from = index + marker.length;
    }
  }

  return [...points].toSorted((left, right) => left - right);
};

const byMode = (text: string, mode: Profile[`chunk`]): string[] => {
  if (text === ``) {
    return [];
  }

  switch (mode) {
    case `char`: {
      return [...text];
    }
    case `greedy`: {
      const size = 48;
      const parts: string[] = [];

      for (let index = 0; index < text.length; index += size) {
        parts.push(text.slice(index, index + size));
      }

      return parts;
    }
    case `line`: {
      const parts: string[] = [];
      let start = 0;

      for (let index = 0; index < text.length; index += 1) {
        if (text.charAt(index) === `\n`) {
          parts.push(text.slice(start, index + 1));
          start = index + 1;
        }
      }

      if (start < text.length) {
        parts.push(text.slice(start));
      }

      return parts;
    }
    case `triple`: {
      const chunks = 3;
      const size = Math.ceil(text.length / chunks);

      return [text.slice(0, size), text.slice(size, size * 2), text.slice(size * 2)].filter(part => part !== ``);
    }
    case `word`: {
      return text.split(/(?<space>\s+)/u).filter(part => part !== ``);
    }
    default: {
      return [text];
    }
  }
};

const parts = (text: string, profile: Profile) => {
  const cuts = cutPoints(text, profile.cutMarkers ?? []);

  if (cuts.length === 0) {
    return byMode(text, profile.chunk);
  }

  const bounds = [0, ...cuts.filter(point => point > 0 && point < text.length), text.length];
  const out: string[] = [];

  for (let index = 0; index < bounds.length - 1; index += 1) {
    const start = bounds[index] ?? 0;
    const end = bounds[index + 1] ?? text.length;

    out.push(...byMode(text.slice(start, end), profile.chunk));
  }

  return out;
};

export type StreamFromConfig = { profile: Profile; signal?: AbortSignal; text: string };

const from = ({ profile, signal = new AbortController().signal, text }: StreamFromConfig): AsyncIterable<string> => {
  const iterate = async function* iterate() {
    const chunks = parts(text, profile);
    let sent = 0;
    let hung = false;
    const hangAt = profile.hangAtRatio === undefined ? undefined : Math.floor(text.length * profile.hangAtRatio);

    for (const chunk of chunks) {
      if (signal.aborted) {
        return;
      }

      if (!hung && hangAt !== undefined && profile.hangMs !== undefined && sent >= hangAt) {
        hung = true;

        try {
          await wait(profile.hangMs, signal);
        } catch {
          return;
        }
      }

      try {
        await wait(profile.delayMs, signal);
      } catch {
        return;
      }

      sent += chunk.length;
      yield chunk;
    }
  };

  return { [Symbol.asyncIterator]: iterate };
};

export const Stream = { from };
