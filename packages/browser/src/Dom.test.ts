/* @vitest-environment jsdom */
/* eslint-disable unicorn/no-null */
import { describe, expect, it, vi } from "vitest";

import { Dom } from "./Dom";

const { each, size, watchSize } = Dom;

const resizeObserver = function resizeObserver(callback: ResizeObserverCallback) {
  resizeObserver.callback = callback;
  resizeObserver.instance = { disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() };

  return resizeObserver.instance;
};
resizeObserver.callback = (() => undefined) as ResizeObserverCallback;
resizeObserver.instance = { disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() };

describe(`each`, () => {
  it(`applies callback to every element`, () => {
    const first = document.createElement(`div`);
    const second = document.createElement(`div`);
    const apply = vi.fn();

    each([first, second], apply);

    expect(apply).toHaveBeenCalledTimes(2);
    expect(apply).toHaveBeenNthCalledWith(1, first);
    expect(apply).toHaveBeenNthCalledWith(2, second);
  });
});

describe(`size`, () => {
  it(`returns bounding client rect dimensions`, () => {
    const element = document.createElement(`div`);
    vi.spyOn(element, `getBoundingClientRect`).mockReturnValue({
      bottom: 0,
      height: 120,
      left: 0,
      right: 0,
      toJSON: () => ({}),
      top: 0,
      width: 320,
      x: 0,
      y: 0,
    });

    expect(size(element)).toStrictEqual({ height: 120, width: 320 });
  });
});

describe(`watchSize`, () => {
  it(`returns noop for missing element`, () => {
    expect(() => watchSize(null, vi.fn())()).not.toThrow();
    expect(() => watchSize(undefined, vi.fn())()).not.toThrow();
  });

  it(`calls onSize immediately and on resize observer callback`, () => {
    const element = document.createElement(`div`);
    const onSize = vi.fn();

    vi.spyOn(element, `getBoundingClientRect`).mockReturnValue({
      bottom: 0,
      height: 80,
      left: 0,
      right: 0,
      toJSON: () => ({}),
      top: 0,
      width: 200,
      x: 0,
      y: 0,
    });
    vi.stubGlobal(`ResizeObserver`, vi.fn(resizeObserver));

    const cleanup = watchSize(element, onSize);

    expect(onSize).toHaveBeenCalledWith({ height: 80, width: 200 });

    vi.spyOn(element, `getBoundingClientRect`).mockReturnValue({
      bottom: 0,
      height: 90,
      left: 0,
      right: 0,
      toJSON: () => ({}),
      top: 0,
      width: 240,
      x: 0,
      y: 0,
    });
    resizeObserver.callback([], resizeObserver.instance);

    expect(onSize).toHaveBeenLastCalledWith({ height: 90, width: 240 });

    cleanup();
  });
});
