/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
import { _ } from "@snappy/core";

import { RemendChar } from "./RemendChar";
import { type Frame, RemendEmphasis } from "./RemendEmphasis";
import { RemendGrapheme } from "./RemendGrapheme";

const fenceTicks = 3;
const fenceTick = `\``;
const hrMinLength = 3;

const lineEnd = (text: string, at: number) => {
  const found = text.indexOf(`\n`, at);

  return found === -1 ? text.length : found;
};

const lineStart = (text: string, at: number) => text.lastIndexOf(`\n`, at - 1) + 1;

const hrLine = (line: string) => {
  const trimmed = line.trim();
  const ch = trimmed[0] ?? ``;

  return (
    trimmed.length >= hrMinLength &&
    [`*`, `-`, `_`].includes(ch) &&
    RemendGrapheme.chars(trimmed).every(char => char === ch || RemendChar.isSpace(char))
  );
};

const tableRow = (line: string) => (line.trimStart()[0] ?? ``) === `|`;
const lineWhitespaceOnly = (slice: string) => RemendGrapheme.chars(slice).every(char => RemendChar.isSpace(char));

const listMarkerSkip = (text: string, at: number) => {
  const rest = text.slice(at);
  const dot = rest.indexOf(`. `);
  const number = dot === -1 ? `` : rest.slice(0, dot);

  const ordered =
    dot !== -1 && number.length > 0 && RemendGrapheme.chars(number).every(char => char >= `0` && char <= `9`)
      ? dot + 2
      : 0;

  return lineWhitespaceOnly(text.slice(lineStart(text, at), at))
    ? rest.startsWith(`* `) || rest.startsWith(`+ `) || rest.startsWith(`- `)
      ? 2
      : ordered
    : 0;
};

const partialFenceTicks = (line: string) => {
  const trimmed = line.trimStart();
  const end = RemendGrapheme.chars(trimmed).findIndex(char => char !== fenceTick);
  const ticks = end === -1 ? trimmed.length : end;

  return ticks > 0 && ticks < fenceTicks ? ticks : undefined;
};

const fenceTicksText = (count: number) => _.gen(count, () => fenceTick).join(``);

const closeOpenFence = (text: string) => {
  const start = text.lastIndexOf(`\n`) + 1;
  const ticks = partialFenceTicks(text.slice(start));

  return ticks === undefined
    ? `${text}\n${fenceTicksText(fenceTicks)}\n`
    : `${text}${fenceTicksText(fenceTicks - ticks)}`;
};

type ScanState = {
  readonly at: number;
  readonly cursor: number;
  readonly inFence: boolean;
  readonly parts: readonly string[];
  readonly stack: readonly Frame[];
};

const scan = (text: string) => {
  const lineAt = (position: number) => text.slice(lineStart(text, position), lineEnd(text, position));

  const emit = (state: ScanState, until: number): ScanState =>
    until > state.cursor
      ? { ...state, cursor: until, parts: [...state.parts, text.slice(state.cursor, until)] }
      : state;

  const flush = (state: ScanState, position: number, active: boolean): ScanState => {
    const { cursor, parts, stack } = RemendEmphasis.flush({
      active,
      cursor: state.cursor,
      lineAt,
      parts: state.parts,
      position,
      stack: state.stack,
      text,
    });

    return { ...state, cursor, parts, stack };
  };

  const afterLineStart = (state: ScanState): ScanState => {
    const { at, stack } = state;

    if (at !== 0 && text[at - 1] !== `\n`) {
      return state;
    }

    const end = lineEnd(text, at);
    const line = text.slice(at, end);

    if (hrLine(line) && !RemendEmphasis.markerOnly(line)) {
      const nextAt = end < text.length ? end + 1 : end;

      return { ...emit(flush(state, at, false), nextAt), at: nextAt };
    }

    return stack.length === 0 ? state : flush(state, at, false);
  };

  const markdownAt = (index: number) => {
    const char = text[index] ?? ``;

    if ([`#`, `*`, `[`, `\n`, `_`, `~`, fenceTick].includes(char)) {
      return true;
    }

    return char === `|` && tableRow(lineAt(index));
  };

  const plainRunEnd = (from: number) => {
    let index = from;

    while (index < text.length && !markdownAt(index)) {
      index += 1;
    }

    return index;
  };

  const afterChar = (state: ScanState): ScanState => {
    const { at, inFence, stack } = state;

    if (at >= text.length) {
      return state;
    }

    if (text[at] === `\n`) {
      const nextAt = at + 1;

      return { ...emit(flush(state, at, false), nextAt), at: nextAt };
    }

    if (text.startsWith(fenceTicksText(fenceTicks), at)) {
      return { ...state, at: at + fenceTicks, inFence: !inFence };
    }

    if (tableRow(lineAt(at)) && text[at] === `|`) {
      return { ...flush(state, at, true), at: at + 1 };
    }

    if (inFence) {
      return { ...state, at: at + 1 };
    }

    const markerSkip = listMarkerSkip(text, at);

    if (markerSkip > 0) {
      return { ...flush(state, at, false), at: at + markerSkip };
    }

    if (stack.length === 0) {
      const end = plainRunEnd(at);

      if (end > at) {
        return { ...state, at: end };
      }
    }

    const emphasis = RemendEmphasis.try(text, at, lineAt(at), at - lineStart(text, at), stack);

    if (emphasis !== undefined) {
      return { ...state, at: emphasis.next, stack: emphasis.stack };
    }

    return { ...state, at: at + 1 };
  };

  const step = (state: ScanState): ScanState => {
    if (state.at >= text.length) {
      return state;
    }

    const lineStarted = afterLineStart(state);

    if (lineStarted.at !== state.at) {
      return lineStarted;
    }

    return afterChar(lineStarted);
  };

  const advance = (state: ScanState): ScanState => {
    let current = state;

    while (current.at < text.length) {
      const next = step(current);

      if (next.at <= current.at) {
        return { ...next, at: Math.min(current.at + 1, text.length) };
      }

      current = next;
    }

    return current;
  };

  const initial: ScanState = { at: 0, cursor: 0, inFence: false, parts: [], stack: [] };
  const scanned = emit(flush(advance(initial), text.length, true), text.length);
  const body = scanned.parts.join(``);

  return scanned.inFence ? closeOpenFence(body) : body;
};

export const RemendDocument = { scan };
