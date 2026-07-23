import { _, Unicode } from "@snappy/core";

import { RemendChar } from "./RemendChar";
import { RemendGrapheme } from "./RemendGrapheme";

export type Kind = `bold` | `boldItalic` | `code` | `italic` | `strike` | `uBold` | `uItalic`;

type Marker = { readonly kind: Kind; readonly text: string };

const fenceTick = `\``;
const codeFenceTicks = 3;
const codeFence = () => _.gen(codeFenceTicks, () => fenceTick).join(``);

const markers: readonly Marker[] = [
  { kind: `boldItalic`, text: `***` },
  { kind: `bold`, text: `**` },
  { kind: `strike`, text: `~~` },
  { kind: `uBold`, text: `__` },
  { kind: `italic`, text: `*` },
  { kind: `uItalic`, text: `_` },
  { kind: `code`, text: fenceTick },
];

export type Frame = { readonly kind: Kind; readonly openAt: number };

const markerFor = (kind: Kind) => markers.find(entry => entry.kind === kind)?.text ?? ``;

const toggle = (stack: readonly Frame[], kind: Kind, openAt: number) =>
  stack.at(-1)?.kind === kind ? stack.slice(0, -1) : [...stack, { kind, openAt }];

const closeStack = (stack: readonly Frame[]) =>
  [...stack]
    .toReversed()
    .map(({ kind }) => markerFor(kind))
    .join(``);

const suffixSkips = markers.flatMap(long =>
  markers
    .filter(short => short.text.length < long.text.length && long.text.endsWith(short.text))
    .map(short => ({ long: long.text, short: short.text })),
);

const suffixSkip = (source: string, position: number) => {
  const hit = suffixSkips.find(({ long, short }) => {
    const start = position - (long.length - short.length);
    const matched = position - start;

    return (
      start >= 0 &&
      matched > 0 &&
      matched < long.length &&
      source.startsWith(short, position) &&
      !source.startsWith(long, position) &&
      source.slice(start, position) === long.slice(0, matched)
    );
  });

  return hit === undefined ? undefined : position + hit.short.length;
};

const closePrefixSkip = (source: string, position: number, kind: Kind) => {
  const marker = markerFor(kind);

  const hit =
    marker.length <= 1
      ? undefined
      : _.gen(marker.length - 1, index => index + 1).find(length => {
          const prefix = marker.slice(0, length);

          return source.startsWith(prefix, position) && !source.startsWith(marker, position);
        });

  return hit === undefined ? undefined : position + hit;
};

const trailingCodeTicks = (source: string, position: number, stack: readonly Frame[]) => {
  const top = stack.at(-1);

  if (top?.kind !== `code` || position !== source.length) {
    return 0;
  }

  const from = top.openAt;

  const firstNonTick = _.gen(position - from, index => position - 1 - index).find(
    index => index >= from && source[index] !== fenceTick,
  );

  return firstNonTick === undefined ? position - from : position - 1 - firstNonTick;
};

const incompleteClosePrefixLength = (source: string, position: number, stack: readonly Frame[]) => {
  const top = stack.at(-1);
  const marker = top === undefined ? `` : markerFor(top.kind);

  return top === undefined || position !== source.length || marker.length <= 1
    ? 0
    : (_.gen(marker.length - 1, index => marker.length - 1 - index).find(length => {
        const prefix = marker.slice(0, length);

        return source.endsWith(prefix) && !source.endsWith(marker);
      }) ?? 0);
};

const charAt = (text: string, index: number) => {
  const code = text.codePointAt(index) ?? 0;

  return String.fromCodePoint(code);
};

const markerAfterOpens = (line: string, offset: number, size: number) => {
  const rest = line.slice(offset + size);
  const next = charAt(rest, 0);

  return rest.length === 0 || (rest[0] ?? ``) === `|`
    ? true
    : RemendChar.isSpace(next)
      ? false
      : RemendChar.content(next);
};

const markerBounded = (line: string, offset: number, size: number, stack: readonly Frame[]) => {
  const before = offset > 0 ? charAt(line, offset - 1) : ``;

  return stack.length > 0
    ? true
    : before !== `` && RemendChar.word(before)
      ? false
      : markerAfterOpens(line, offset, size);
};

const markerOnly = (line: string) => {
  const trimmed = line.trim();
  const only = (chars: string) => RemendGrapheme.chars(trimmed).every(char => chars.includes(char));

  return trimmed.length === 0 ? false : only(`*`) || only(`_`) || trimmed === `~~`;
};

const tryAt = (text: string, position: number, line: string, offset: number, stack: readonly Frame[]) => {
  const top = stack.at(-1);

  if (top !== undefined) {
    const marker = markerFor(top.kind);

    if (top.kind === `code` && text.startsWith(fenceTick, position) && text.startsWith(fenceTick, position + 1)) {
      return { next: position + 2, stack };
    }

    if (text.startsWith(marker, position) && markerBounded(line, offset, marker.length, stack)) {
      return { next: position + marker.length, stack: toggle(stack, top.kind, position + marker.length) };
    }

    const prefixSkipped = closePrefixSkip(text, position, top.kind);

    if (prefixSkipped !== undefined) {
      return { next: prefixSkipped, stack };
    }
  }

  if (stack.length === 0) {
    const skipped = suffixSkip(text, position);

    if (skipped !== undefined) {
      return { next: skipped, stack };
    }
  }

  const matched = markers.find(({ text: marker }) => text.startsWith(marker, position));

  if (matched === undefined) {
    return undefined;
  }

  if (stack.at(-1)?.kind === `code` && matched.kind !== `code`) {
    return undefined;
  }

  if (matched.kind === `code` && text.startsWith(codeFence(), position)) {
    return undefined;
  }

  const nextStack = markerBounded(line, offset, matched.text.length, stack)
    ? toggle(stack, matched.kind, position + matched.text.length)
    : stack;

  return { next: position + matched.text.length, stack: nextStack };
};

const flush = ({
  active,
  cursor,
  lineAt,
  parts,
  position,
  stack,
  text,
}: {
  readonly active: boolean;
  readonly cursor: number;
  readonly lineAt: (position: number) => string;
  readonly parts: readonly string[];
  readonly position: number;
  readonly stack: readonly Frame[];
  readonly text: string;
}) => {
  if (stack.length === 0) {
    return { cursor, parts, stack };
  }

  if (!active) {
    return { cursor, parts, stack: [] as readonly Frame[] };
  }

  const trim = (at: number): number => (at > cursor && RemendChar.isSpace(text[at - 1] ?? ``) ? trim(at - 1) : at);
  const flushAt = trim(position);
  const rangeOpenAt = stack[0]?.openAt ?? flushAt;
  const inner = text.slice(rangeOpenAt, flushAt).trim();
  const tailWsOnly = text.slice(flushAt, position).trim() === `` && flushAt < position;

  if (inner === ``) {
    if (tailWsOnly) {
      return { cursor, parts, stack: [] as readonly Frame[] };
    }

    if (markerOnly(lineAt(position))) {
      return {
        cursor: position,
        parts: [...parts, text.slice(cursor, position), Unicode.zeroWidthSpace, closeStack(stack)],
        stack: [] as readonly Frame[],
      };
    }

    return {
      cursor: flushAt,
      parts: [...parts, text.slice(cursor, flushAt), Unicode.zeroWidthSpace, closeStack(stack)],
      stack: [] as readonly Frame[],
    };
  }

  const prefixLength = incompleteClosePrefixLength(text, position, stack) || trailingCodeTicks(text, position, stack);

  if (prefixLength > 0) {
    const beforePrefix = trim(position - prefixLength);
    const prefixOpenAt = stack[0]?.openAt ?? beforePrefix;

    if (text.slice(prefixOpenAt, beforePrefix).trim() !== ``) {
      return {
        cursor: position,
        parts: [...parts, text.slice(cursor, beforePrefix), closeStack(stack)],
        stack: [] as readonly Frame[],
      };
    }
  }

  const topOpenAt = stack.at(-1)?.openAt ?? flushAt;
  const emptyTop = text.slice(topOpenAt, flushAt).trim() === ``;
  const tail = flushAt < position ? text.slice(flushAt, position) : ``;

  return {
    cursor: position,
    parts: [
      ...parts,
      text.slice(cursor, flushAt),
      ...(emptyTop ? [Unicode.zeroWidthSpace] : []),
      closeStack(stack),
      ...(tail === `` ? [] : [tail]),
    ],
    stack: [] as readonly Frame[],
  };
};

export const RemendEmphasis = { flush, markerOnly, try: tryAt };
