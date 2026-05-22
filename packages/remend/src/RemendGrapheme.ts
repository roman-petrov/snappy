import { _, Unicode } from "@snappy/core";

const graphemes = (text: string) => [...new Intl.Segmenter(undefined, { granularity: `grapheme` }).segment(text)];
const chars = (text: string) => graphemes(text).map(({ segment }) => segment);

const loneHighSurrogate = (segment: string) => {
  const code = segment.codePointAt(0) ?? 0;

  return (
    segment.length === 1 && code >= Unicode.codePoint.highSurrogateMin && code <= Unicode.codePoint.highSurrogateMax
  );
};

const regionalIndicatorsIn = (text: string) =>
  _.gen(text.length, index => text.codePointAt(index) ?? 0).filter(
    code => code >= Unicode.codePoint.regionalIndicatorMin && code <= Unicode.codePoint.regionalIndicatorMax,
  );

type GraphemeSegment = { readonly segment: string };

const trim = (text: string) => {
  const trimOnce = (segments: readonly GraphemeSegment[]): readonly GraphemeSegment[] => {
    const tail = segments.map(({ segment }) => segment).join(``);

    return regionalIndicatorsIn(tail).length % 2 === 0 ? segments : trimOnce(segments.slice(0, -1));
  };

  const segments = trimOnce(graphemes(text).filter(({ segment }) => !loneHighSurrogate(segment)));

  return segments.map(({ segment }) => segment).join(``);
};

const loneSurrogateIn = (text: string) => chars(text).some(loneHighSurrogate);
const regionalIn = (text: string) => regionalIndicatorsIn(text).length > 0;
const needsTrim = (text: string) => loneSurrogateIn(text) || (regionalIn(text) && trim(text) !== text);

export const RemendGrapheme = { chars, needsTrim, trim };
