/* eslint-disable unicorn/no-null */
import type { Ease } from "@snappy/core";

import { describe, expect, it, vi } from "vitest";

import { TabPagerDom, type TabPagerFrameInput } from "./TabPager.dom";

vi.mock(`@snappy/platform`, () => ({ Vibrate: { trigger: vi.fn() } }));

const linear: Ease = ratio => ratio;

const items: TabPagerFrameInput[`items`] = [
  { color: `primary`, id: `a`, path: `/a` },
  { color: `success`, id: `b`, path: `/b` },
  { color: `error`, id: `c`, path: `/c` },
];

const rect = (width: number, height = 100) => ({
  bottom: 0,
  height,
  left: 0,
  right: width,
  toJSON: () => ({}),
  top: 0,
  width,
  x: 0,
  y: 0,
});

const frameInput = (touch = true, navigate = vi.fn()) => ({
  barOffset: undefined as number | undefined,
  ease: linear,
  items,
  navigate,
  pathname: `/a`,
  touch,
});

const resizeObserver = function resizeObserver() {
  return { disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() };
};

const stubResizeObserver = () => {
  vi.stubGlobal(`ResizeObserver`, vi.fn(resizeObserver));
};

const restoreDom = () => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
};

const withDom = (run: () => void) => {
  stubResizeObserver();

  try {
    run();
  } finally {
    restoreDom();
  }
};

const clientWidth = (element: HTMLElement, width: number) => {
  Object.defineProperty(element, `clientWidth`, { configurable: true, value: width });
};

const createDom = (touch = true, width = 300) => {
  const root = document.createElement(`div`);
  const track = document.createElement(`div`);
  clientWidth(root, width);
  vi.spyOn(track, `getBoundingClientRect`).mockReturnValue(rect(width));

  const contentRef = { current: root };
  const setBarOffset = vi.fn();
  const setSettling = vi.fn();
  const dom = TabPagerDom({ contentRef, setBarOffset, setSettling });
  dom.trackRef.current = track;

  return { contentRef, dom, root, setBarOffset, setSettling, touch, track };
};

const pointerRoot = (root: HTMLDivElement) => {
  Object.defineProperty(root, `setPointerCapture`, { configurable: true, value: vi.fn() });
  Object.defineProperty(root, `releasePointerCapture`, { configurable: true, value: vi.fn() });
};

describe(`layout`, () => {
  it(`sets track transform on touch`, () => {
    withDom(() => {
      const { dom, touch, track } = createDom(true);

      dom.frame({ ...frameInput(touch), pathname: `/b` });
      dom.layout(true);

      expect(track.style.transform).toBe(`translateX(-300px)`);
    });
  });

  it(`clears track transform without touch`, () => {
    withDom(() => {
      const { dom, touch, track } = createDom(false);

      dom.frame({ ...frameInput(touch), pathname: `/b` });
      dom.layout(true);

      expect(track.style.transform).toBe(``);
    });
  });
});

describe(`frame`, () => {
  it(`resolves index and bar metrics`, () => {
    withDom(() => {
      const { dom, touch } = createDom();

      expect(dom.frame({ ...frameInput(touch), pathname: `/b` })).toMatchObject({ barIndex: 1, index: 1 });
      expect(dom.frame({ ...frameInput(touch), barOffset: 0.5, pathname: `/a` })).toMatchObject({
        barIndex: 1,
        index: 0,
      });
    });
  });

  it(`returns tint styles`, () => {
    withDom(() => {
      const { dom, touch } = createDom();
      const { panelTints } = dom.frame({ ...frameInput(touch), pathname: `/a` });

      expect(panelTints[0]?.opacity).toBe(1);
      expect(panelTints[1]?.opacity).toBe(0);
    });
  });
});

describe(`pointer`, () => {
  it(`updates transform on horizontal swipe`, () => {
    withDom(() => {
      const { dom, root, touch, track } = createDom(true, 100);

      dom.frame({ ...frameInput(touch), pathname: `/b` });
      pointerRoot(root);
      const cleanup = dom.pointer();

      root.dispatchEvent(
        new PointerEvent(`pointerdown`, { bubbles: true, button: 0, clientX: 0, clientY: 0, pointerId: 1 }),
      );
      root.dispatchEvent(new PointerEvent(`pointermove`, { bubbles: true, clientX: -50, clientY: 0, pointerId: 1 }));
      root.dispatchEvent(new PointerEvent(`pointerup`, { bubbles: true, clientX: -50, clientY: 0, pointerId: 1 }));

      expect(track.style.transform).toBe(`translateX(-150px)`);

      cleanup();
    });
  });

  it(`returns noop for missing root`, () => {
    withDom(() => {
      const { contentRef, dom } = createDom();
      (contentRef as { current: HTMLElement | null }).current = null;

      expect(() => dom.pointer()()).not.toThrow();
    });
  });
});

describe(`select`, () => {
  it(`navigates to selected tab`, () => {
    withDom(() => {
      let time = 0;
      const navigate = vi.fn();
      vi.spyOn(performance, `now`).mockImplementation(() => time);
      vi.spyOn(window, `requestAnimationFrame`).mockImplementation(callback => {
        time += 130;
        callback(time);

        return time;
      });

      const { dom, touch } = createDom(false);

      dom.frame({ ...frameInput(touch, navigate), pathname: `/a` });
      dom.layout(true);
      dom.select(`b`);

      expect(navigate).toHaveBeenCalledWith(`/b`);
    });
  });
});

describe(`pointer cleanup`, () => {
  it(`cancels pending animation frame`, () => {
    withDom(() => {
      let frame = 0;
      const navigate = vi.fn();
      vi.spyOn(performance, `now`).mockImplementation(() => 0);
      vi.spyOn(window, `requestAnimationFrame`).mockImplementation(() => {
        frame += 50;

        return frame;
      });
      const cancel = vi.spyOn(window, `cancelAnimationFrame`).mockImplementation(() => undefined);
      const { dom, touch } = createDom(false);

      dom.frame({ ...frameInput(touch, navigate), pathname: `/a` });
      dom.layout(true);
      dom.select(`b`);
      dom.pointer()();

      expect(cancel).toHaveBeenCalledWith(frame);
    });
  });
});
