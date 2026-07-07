/* eslint-disable functional/no-loop-statements */
/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { _, Rgb, type RgbVec } from "@snappy/core";
import { ThemeVar } from "@snappy/hooks";

type SlideState = { accents: readonly string[]; pageIndex: number };

const accentVar = `chrome-accent`;
const hosts = new Set<HTMLElement>();
const rgbCache = new Map<string, RgbVec>();
let probe: HTMLDivElement | undefined;
let raster: CanvasRenderingContext2D | null | undefined;
let meta: HTMLMetaElement | undefined;
let last = ``;
let pending: SlideState | undefined;
let presented = false;
let tint: number | undefined;

const active = (accents: readonly string[], pageIndex: number) =>
  accents.flatMap((accent, slot) => {
    const opacity = Math.max(0, 1 - Math.abs(pageIndex - slot));

    return opacity > 0 ? [{ accent, opacity }] : [];
  });

const resolve = (css: string) => {
  if (typeof document === `undefined`) {
    return css;
  }

  probe ??= document.createElement(`div`);
  probe.style.position = `fixed`;
  probe.style.left = `-9999px`;
  probe.style.width = `1px`;
  probe.style.height = `1px`;
  probe.style.visibility = `hidden`;
  probe.style.pointerEvents = `none`;

  if (!probe.isConnected) {
    document.documentElement.append(probe);
  }

  probe.style.backgroundColor = css;

  return getComputedStyle(probe).backgroundColor;
};

const toRgb = (color: string): RgbVec => {
  raster ??= document.createElement(`canvas`).getContext(`2d`, { willReadFrequently: true });

  if (raster === null) {
    return Rgb.parse(color);
  }

  raster.clearRect(0, 0, 1, 1);
  raster.fillStyle = color;
  raster.fillRect(0, 0, 1, 1);

  const [r = 0, g = 0, b = 0] = raster.getImageData(0, 0, 1, 1).data;

  return [r, g, b];
};

const rgbOf = (css: string): RgbVec => {
  const hit = rgbCache.get(css);

  if (hit !== undefined) {
    return hit;
  }

  const rgb = toRgb(resolve(css));
  rgbCache.set(css, rgb);

  return rgb;
};

const blendRgb = ({ accents, pageIndex }: SlideState): RgbVec => {
  const [first, second] = active(accents, pageIndex);

  return first === undefined
    ? rgbOf(ThemeVar.ref(`color-surface`))
    : second === undefined
      ? rgbOf(first.accent)
      : Rgb.mix(rgbOf(first.accent), rgbOf(second.accent), second.opacity);
};

const metaRgb = (accent: RgbVec) => {
  tint ??= _.ratio(_.dec(ThemeVar.read(`chrome-tint-ratio`)) ?? 0, _.percentScale);

  return Rgb.mix(rgbOf(ThemeVar.ref(`color-backdrop`)), accent, tint);
};

const metaElement = () => {
  if (typeof document === `undefined`) {
    return undefined;
  }

  if (meta?.isConnected !== true) {
    meta = document.querySelector(`meta[name="theme-color"]`) ?? undefined;
  }

  if (meta === undefined) {
    meta = document.createElement(`meta`);
    meta.name = `theme-color`;
    document.head.append(meta);
  }

  return meta;
};

const paintMeta = (accent?: RgbVec) => {
  const css = Rgb.css(presented && accent !== undefined ? metaRgb(accent) : rgbOf(ThemeVar.ref(`color-backdrop`)));
  const element = metaElement();
  const content = element?.getAttribute(`content`);

  if (css === last && content === css) {
    return;
  }

  last = css;
  element?.setAttribute(`content`, css);
};

const flush = () => {
  const accent = pending === undefined ? undefined : blendRgb(pending);

  if (accent !== undefined) {
    const css = Rgb.css(accent);

    for (const host of hosts) {
      ThemeVar.write(accentVar, css, host);
    }
  }

  paintMeta(accent);
};

const slide = (accents: readonly string[], pageIndex: number) => {
  pending = { accents, pageIndex };
  flush();
};

const mount = (host: HTMLElement) => {
  hosts.add(host);

  if (pending !== undefined) {
    ThemeVar.write(accentVar, Rgb.css(blendRgb(pending)), host);
  }

  return () => hosts.delete(host);
};

const present = (on: boolean) => {
  if (on === presented) {
    return;
  }

  presented = on;
  flush();
};

const sync = () => {
  rgbCache.clear();
  tint = undefined;
  flush();
};

export const Chrome = { active, mount, present, slide, sync };
