import { _ } from "@snappy/core";

const suffix = `If this CSS property is unavoidable, disable this stylelint warning at the top of the file.`;
const message = (text: string) => `${text}. ${suffix}`;
const recommend = (mechanism: string) => message(`Use ${mechanism}`);

const messages = {
  "-webkit-backdrop-filter": recommend(`glass or Surface mechanics`),
  "-webkit-tap-highlight-color": recommend(`tap/interaction mechanics`),
  "-webkit-user-drag": recommend(`tap/interaction mechanics`),
  "all": message(`Avoid local reset styles`),
  "appearance": message(`This is already covered by global base styles`),
  "backdrop-filter": recommend(`glass or Surface mechanics`),
  "background": recommend(`Surface or color tokens`),
  "background-color": recommend(`Surface or color tokens`),
  "border-color": recommend(`Surface or color tokens`),
  "border-radius": recommend(`radius or primitives mechanics`),
  "box-shadow": recommend(`elevation mechanics`),
  "box-sizing": message(`This is already covered by global base styles`),
  "color": recommend(`Surface or color tokens`),
  "font": recommend(`typography mechanics`),
  "font-family": recommend(`typography mechanics`),
  "font-feature-settings": recommend(`typography mechanics`),
  "font-size": recommend(`typography mechanics`),
  "font-style": recommend(`typography mechanics`),
  "font-variation-settings": recommend(`typography mechanics`),
  "font-weight": recommend(`typography mechanics`),
  "letter-spacing": recommend(`typography mechanics`),
  "line-height": recommend(`typography mechanics`),
  "outline": message(`This is already covered by global base styles; use the focus mixin for focus styles`),
  "text-transform": recommend(`typography mechanics`),
  "user-select": recommend(`tap/interaction mechanics`),
  "z-index": message(`Avoid manual stacking`),
} as const;

export const StylelintPropertyDisallowedList = [
  _.keys(messages),
  { message: (property: keyof typeof messages) => messages[property] },
];
