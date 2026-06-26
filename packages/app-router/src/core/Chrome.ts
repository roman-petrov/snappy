/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { _ } from "@snappy/core";
import { ThemeVar } from "@snappy/hooks";

const accentVar = `chrome-accent`;
let probe: HTMLDivElement | undefined;
let meta: HTMLMetaElement | undefined;
let last = ``;
let pending: string | undefined;
let presented = false;
const mix = (accent: string, ratio: number, base: string) => `color-mix(in srgb, ${accent} ${ratio}%, ${base})`;
const slotOpacity = (pageIndex: number, slot: number) => Math.max(0, 1 - Math.abs(pageIndex - slot));

const blend = (accents: readonly string[], pageIndex: number) => {
  const active = accents.flatMap((accent, slot) => {
    const opacity = slotOpacity(pageIndex, slot);

    return opacity > 0 ? [{ accent, opacity }] : [];
  });

  const [first, second] = active;

  return first === undefined
    ? ThemeVar.ref(`color-surface`)
    : second === undefined
      ? first.accent
      : mix(first.accent, _.percent(first.opacity, first.opacity + second.opacity), second.accent);
};

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

const writeMeta = (css: string) => {
  const resolved = resolve(css);
  const element = metaElement();
  const content = element?.getAttribute(`content`);

  if (resolved === last && content === resolved) {
    return;
  }

  last = resolved;
  element?.setAttribute(`content`, resolved);
};

const backdrop = () => ThemeVar.ref(`color-backdrop`);
const metaColor = () => ThemeVar.ref(`chrome-meta-color`);

const paintMeta = () => {
  writeMeta(presented && pending !== undefined ? resolve(metaColor()) : backdrop());
};

const publish = (accent: string) => {
  if (accent === pending) {
    return;
  }

  pending = accent;
  ThemeVar.write(accentVar, accent);

  if (presented) {
    paintMeta();
  }
};

const present = (active: boolean) => {
  if (active === presented) {
    return;
  }

  presented = active;
  paintMeta();
};

const sync = () => {
  if (pending !== undefined) {
    ThemeVar.write(accentVar, pending);
  }

  paintMeta();
};

const opacities = (count: number, pageIndex: number) => _.gen(count, slot => slotOpacity(pageIndex, slot));

export const Chrome = { blend, opacities, present, publish, sync };
