// cspell:disable
import { Unicode } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { Remend } from "./Remend";

const { apply } = Remend;
const zwsp = Unicode.zeroWidthSpace;

type Kind = {
  readonly abandon: string;
  readonly balanced: string;
  readonly incompleteEnd?: { readonly in: string; readonly out: string };
  readonly marker: string;
  readonly mid: string;
  readonly phrase: string;
  readonly sample: string;
  readonly spaced: { readonly in: string; readonly out: string };
  readonly streamLetter: string;
  readonly word: string;
};

const kinds: readonly Kind[] = [
  {
    abandon: `Hello`,
    balanced: `bold`,
    marker: `**`,
    mid: `a**b`,
    phrase: `one two three`,
    sample: `bo`,
    spaced: { in: `version 2 ** 3`, out: `version 2 ** 3` },
    streamLetter: `w`,
    word: `hello`,
  },
  {
    abandon: `Hello * `,
    balanced: `italic`,
    marker: `*`,
    mid: `a*b`,
    phrase: `one two three`,
    sample: `it`,
    spaced: { in: `Multiply a * b when both are posit`, out: `Multiply a * b when both are posit` },
    streamLetter: `i`,
    word: `hello`,
  },
  {
    abandon: `Hello`,
    balanced: `both`,
    incompleteEnd: { in: `***bi**`, out: `***bi***` },
    marker: `***`,
    mid: `a***b`,
    phrase: `one two three`,
    sample: `x`,
    spaced: { in: `item *** 1`, out: `item *** 1` },
    streamLetter: `b`,
    word: `bi`,
  },
  {
    abandon: `Hello`,
    balanced: `strike`,
    marker: `~~`,
    mid: `a~~b`,
    phrase: `one two three`,
    sample: `st`,
    spaced: { in: `2 ~~ 3`, out: `2 ~~ 3` },
    streamLetter: `s`,
    word: `strike`,
  },
  {
    abandon: `Hello`,
    balanced: `bold`,
    marker: `__`,
    mid: `a__b`,
    phrase: `one two three`,
    sample: `bo`,
    spaced: { in: `version 2 __ 3`, out: `version 2 __ 3` },
    streamLetter: `w`,
    word: `hello`,
  },
  {
    abandon: `Hello _ `,
    balanced: `italic`,
    marker: `_`,
    mid: `a_b`,
    phrase: `one two three`,
    sample: `it`,
    spaced: { in: `Multiply a _ b when both are posit`, out: `Multiply a _ b when both are posit` },
    streamLetter: `i`,
    word: `hello`,
  },
  {
    abandon: `Hello`,
    balanced: `code`,
    incompleteEnd: { in: `\`code world\`\``, out: `\`code world\`` },
    marker: `\``,
    mid: `a\`b`,
    phrase: `one two three`,
    sample: `code`,
    spaced: { in: `version 2 \` 3`, out: `version 2 \` 3` },
    streamLetter: `c`,
    word: `code`,
  },
];

const multiChar = kinds.filter(({ marker }) => marker.length > 1);
const phraseEndMulti = kinds.filter(({ marker }) => marker.length > 1);
const phraseEndCode = kinds.filter(({ marker }) => marker === `\``);

type KindWithIncomplete = Kind & { readonly incompleteEnd: { readonly in: string; readonly out: string } };

const multiCharIncomplete = multiChar.filter((kind): kind is KindWithIncomplete => kind.incompleteEnd !== undefined);
const streamGrowingMulti = kinds.filter(({ marker }) => marker.length > 1);
const streamGrowingCode = kinds.filter(({ marker }) => marker === `\``);
const wrap = ({ balanced, marker }: Kind) => `${marker}${balanced}${marker}`;
const closed = ({ marker, sample }: Kind, text = sample) => `${marker}${text}${marker}`;
const partial = ({ marker, sample }: Kind, text = sample) => `${marker}${text}`;
const closePrefix = (marker: string) => marker.slice(0, -1);

describe(`apply`, () => {
  describe(`emphasis`, () => {
    it.each(kinds)(`leaves balanced $marker unchanged`, kind => {
      expect(apply(wrap(kind))).toBe(wrap(kind));
    });

    it(`leaves mixed balanced emphasis on one line unchanged`, () => {
      expect(apply(`**b** *i* ***bi*** ~~s~~ __b__ _i_ \`c\``)).toBe(`**b** *i* ***bi*** ~~s~~ __b__ _i_ \`c\``);
    });

    it(`leaves horizontal rule line unchanged`, () => {
      expect(apply(`---`)).toBe(`---`);
    });

    it.each(kinds)(`leaves text after closed $marker unchanged`, kind => {
      expect(apply(`${wrap(kind)}.`)).toBe(`${wrap(kind)}.`);
    });

    it.each(kinds)(`closes marker-only $marker with zero-width space`, ({ marker }) => {
      expect(apply(marker)).toBe(`${marker}${zwsp}${marker}`);
    });

    it.each(kinds)(`closes empty open $marker with zero-width space`, ({ marker }) => {
      expect(apply(`word ${marker}`)).toBe(`word ${marker}${zwsp}${marker}`);
    });

    it.each(kinds)(`leaves mid-word $marker unchanged`, ({ mid }) => {
      expect(apply(mid)).toBe(mid);
    });

    it.each(kinds)(`closes partial $marker at end of input`, kind => {
      expect(apply(partial(kind))).toBe(closed(kind));
    });

    it.each(kinds)(`closes partial $marker before trailing space at end of input`, kind => {
      expect(apply(`${partial(kind)} `)).toBe(`${closed(kind)} `);
    });

    it.each(kinds)(`streams $marker word through trailing space without spaced closers`, kind => {
      expect(apply(`${partial(kind, kind.word)} `)).toBe(`${closed(kind, kind.word)} `);
      expect(apply(`Hello ${partial(kind, kind.streamLetter)} `)).toBe(`Hello ${closed(kind, kind.streamLetter)} `);
    });

    it.each(kinds)(`does not close partial $marker on non-last line`, kind => {
      expect(apply(`line ${partial(kind)}\nnext`)).toBe(`line ${partial(kind)}\nnext`);
    });

    it.each(kinds)(`does not close prose $marker before table on prior line`, kind => {
      expect(apply(`Intro ${partial(kind)}\n| C |`)).toBe(`Intro ${partial(kind)}\n| C |\n| --- |`);
    });

    it.each(kinds)(`abandons $marker when only whitespace follows open marker`, kind => {
      expect(apply(`Hello ${kind.marker} `)).toBe(kind.abandon);
    });

    it.each(kinds)(`does not remend spaced prose as $marker`, ({ spaced }) => {
      expect(apply(spaced.in)).toBe(spaced.out);
    });

    it(`leaves trailing suffix after closed multi-char marker`, () => {
      expect(apply(`**test***`)).toBe(`**test***`);
      expect(apply(`***test****`)).toBe(`***test****`);
      expect(apply(`__test___`)).toBe(`__test___`);
    });

    it.each(phraseEndMulti)(`closes $marker before incomplete close prefix at phrase end`, kind => {
      const phrase = `Say ${partial(kind, kind.phrase)}`;

      expect(apply(phrase)).toBe(`Say ${closed(kind, kind.phrase)}`);
      expect(apply(`${phrase}${closePrefix(kind.marker)}`)).toBe(`Say ${closed(kind, kind.phrase)}`);
      expect(apply(`${phrase}${kind.marker}`)).toBe(`Say ${closed(kind, kind.phrase)}`);
    });

    it.each(phraseEndCode)(`closes $marker before incomplete close prefix at phrase end`, kind => {
      const phrase = `Say ${partial(kind, kind.phrase)}`;

      expect(apply(phrase)).toBe(`Say ${closed(kind, kind.phrase)}`);
      expect(apply(`${phrase}${kind.marker}`)).toBe(`Say ${closed(kind, kind.phrase)}`);
      expect(apply(`${phrase}${kind.marker}${kind.marker}`)).toBe(`Say ${closed(kind, kind.phrase)}`);
    });

    it.each(multiChar)(`closes $marker before incomplete close prefix at end`, kind => {
      const tail = closePrefix(kind.marker);

      expect(apply(`${partial(kind, `${kind.word} world`)}${tail}`)).toBe(closed(kind, `${kind.word} world`));
      expect(apply(`Hello ${partial(kind, `world`)}${tail}`)).toBe(`Hello ${closed(kind, `world`)}`);
    });

    it.each(multiCharIncomplete)(`closes $marker before incomplete close prefix at end (partial tail)`, kind => {
      expect(apply(kind.incompleteEnd.in)).toBe(kind.incompleteEnd.out);
    });

    it(`closes partial emphasis on last line only in multi-line buffer`, () => {
      expect(apply(`line **bo\nnext **x`)).toBe(`line **bo\nnext **x**`);
    });

    it.each(kinds)(`streams partial $marker without rolling back prefix`, kind => {
      const label = `${kind.marker}test${kind.marker}`;

      expect(apply(`Hello ${partial(kind, kind.streamLetter)}`)).toBe(`Hello ${closed(kind, kind.streamLetter)}`);
      expect(apply(`${label}: ${partial(kind, kind.streamLetter)}`)).toBe(
        `${label}: ${closed(kind, kind.streamLetter)}`,
      );
    });

    it.each(kinds)(`streams growing $marker without empty flash or extra closers`, kind => {
      const { marker, word } = kind;

      expect(apply(marker)).toBe(`${marker}${zwsp}${marker}`);

      for (let length = 1; length <= word.length; length += 1) {
        const chunk = word.slice(0, length);

        expect(apply(`${marker}${chunk}`)).toBe(`${marker}${chunk}${marker}`);
      }

      expect(apply(`${marker}${word} `)).toBe(`${marker}${word}${marker} `);
      expect(apply(`${marker}${word} ${word[0]}`)).toBe(`${marker}${word} ${word[0]}${marker}`);
    });

    it.each(streamGrowingMulti)(`streams growing $marker with incomplete close prefix at end`, kind => {
      const { marker, word } = kind;
      const phrase = `${word} world`;

      expect(apply(`${marker}${phrase}${closePrefix(marker)}`)).toBe(`${marker}${phrase}${marker}`);
      expect(apply(`${marker}${phrase}${marker}`)).toBe(`${marker}${phrase}${marker}`);
    });

    it.each(streamGrowingCode)(`streams growing $marker with incomplete close prefix at end`, kind => {
      const { marker, word } = kind;
      const phrase = `${word} world`;

      expect(apply(`${marker}${phrase}`)).toBe(`${marker}${phrase}${marker}`);
      expect(apply(`${marker}${phrase}${marker}`)).toBe(`${marker}${phrase}${marker}`);
      expect(apply(`${marker}${phrase}${marker}${marker}`)).toBe(`${marker}${phrase}${marker}`);
    });
  });
});
