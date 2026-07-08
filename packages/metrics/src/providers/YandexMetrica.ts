// cspell:word clickmap webvisor
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { Dom } from "@snappy/browser";
import { _ } from "@snappy/core";
import { Platform } from "@snappy/platform";

import type { MetricsParameters, MetricsProvider } from "../Types";

declare global {
  interface Window {
    ym?: ((counterId: number, method: string, ...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
  }
}

export const YandexMetrica = (counterId: number): MetricsProvider => {
  const scriptUrl = `https://mc.yandex.ru/metrika/tag.js`;

  const loadScript = async () => {
    await new Promise<void>(resolve => {
      const element = document.createElement(`script`);
      element.async = true;
      element.src = scriptUrl;
      Dom.subscribe(element, `load`, () => resolve());
      Dom.subscribe(element, `error`, () => resolve());
      document.head.append(element);
    });
  };

  const stub = () => {
    if (window.ym !== undefined) {
      return;
    }

    const queue: unknown[][] = [];

    const ym = (...args: unknown[]) => {
      queue.push(args);
    };

    ym.a = queue;
    ym.l = _.now();
    window.ym = ym;
  };

  const call = (method: string, ...args: unknown[]) => window.ym?.(counterId, method, ...args);
  let started = false;

  const init = async () => {
    await loadScript();
    call(`init`, { accurateTrackBounce: true, clickmap: true, defer: true, trackLinks: true, webvisor: false });
  };

  const run = (action: () => void) => {
    if (!started) {
      started = true;
      stub();
      void init();
    }

    action();
  };

  const withPlatform = (value?: MetricsParameters): MetricsParameters => ({ platform: Platform(), ...value });

  const event = (name: string, value?: MetricsParameters) =>
    run(() => call(`reachGoal`, `click`, { ...withPlatform(value), tag: name }));

  const page = (path: string, value?: MetricsParameters) =>
    run(() => call(`hit`, path, { params: withPlatform(value) }));

  return { event, page };
};
