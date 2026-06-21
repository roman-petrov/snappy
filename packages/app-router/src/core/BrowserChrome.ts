/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { ThemeVar } from "@snappy/hooks";

export const BrowserChrome = () => {
  let probe: HTMLDivElement | undefined;
  let meta: HTMLMetaElement | undefined;
  let last = ``;
  let override: string | undefined;

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

  const paint = (css: string) => {
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
  const sync = () => paint(override ?? backdrop());

  const apply = (css: string) => {
    override = css;
    paint(css);
  };

  const reset = () => {
    override = undefined;
    paint(backdrop());
  };

  return { apply, reset, sync };
};

const chrome = BrowserChrome();

export const Chrome = { reset: chrome.reset };
