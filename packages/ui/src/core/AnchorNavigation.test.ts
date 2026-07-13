/* @vitest-environment jsdom */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { describe, expect, it } from "vitest";

import { AnchorNavigation } from "./AnchorNavigation";

const { base, fromClick } = AnchorNavigation;
const routeAt = (pathname: string) => (pathname === `/alpha` || pathname === `/beta` ? pathname : undefined);

const anchor = (href: string, options: { download?: boolean; target?: string } = {}) => {
  const element = document.createElement(`a`);
  element.href = href;
  if (options.download === true) {
    element.setAttribute(`download`, ``);
  }
  if (options.target !== undefined) {
    element.target = options.target;
  }

  const inner = document.createElement(`span`);
  inner.textContent = `link`;
  element.append(inner);
  document.body.append(element);

  return element;
};

const click = (target: EventTarget, overrides: Partial<MouseEvent> = {}) =>
  ({
    altKey: false,
    button: 0,
    ctrlKey: false,
    defaultPrevented: false,
    metaKey: false,
    shiftKey: false,
    target,
    ...overrides,
  }) as MouseEvent;

describe(`base`, () => {
  it(`returns empty base for app root`, () => {
    expect(base(`/`)).toBe(``);
  });

  it(`strips trailing slash from router base`, () => {
    expect(base(`/prefix/`)).toBe(`/prefix`);
  });

  it(`keeps router base without trailing slash`, () => {
    expect(base(`/prefix`)).toBe(`/prefix`);
  });
});

describe(`fromClick`, () => {
  it(`returns spa route for same-origin internal link`, () => {
    window.history.pushState({}, ``, `/prefix/beta`);
    const link = anchor(`alpha`);

    expect(fromClick(click(link), `/prefix`, routeAt)).toBe(`/alpha`);
  });

  it(`includes search params in spa route`, () => {
    window.history.pushState({}, ``, `/prefix/beta`);
    const link = anchor(`alpha?q=1`);

    expect(fromClick(click(link), `/prefix`, routeAt)).toBe(`/alpha?q=1`);
  });

  it(`returns undefined for unknown route`, () => {
    window.history.pushState({}, ``, `/prefix/beta`);
    const link = anchor(`missing`);

    expect(fromClick(click(link), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`returns undefined when click was already handled`, () => {
    const link = anchor(`alpha`);

    expect(fromClick(click(link, { defaultPrevented: true }), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`returns undefined for modified click`, () => {
    const link = anchor(`alpha`);

    expect(fromClick(click(link, { metaKey: true }), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`returns undefined when target is not inside a link`, () => {
    const button = document.createElement(`button`);
    document.body.append(button);

    expect(fromClick(click(button), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`returns undefined for download links`, () => {
    const link = anchor(`alpha`, { download: true });

    expect(fromClick(click(link), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`returns undefined for links that open a new tab`, () => {
    const link = anchor(`alpha`, { target: `_blank` });

    expect(fromClick(click(link), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`returns undefined for hash links`, () => {
    const link = anchor(`#section`);

    expect(fromClick(click(link), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`returns undefined for mailto links`, () => {
    const link = anchor(`mailto:test@example.com`);

    expect(fromClick(click(link), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`returns undefined for external links`, () => {
    const link = anchor(`https://example.com/alpha`);

    expect(fromClick(click(link), `/prefix`, routeAt)).toBeUndefined();
  });

  it(`resolves clicks on nested link content`, () => {
    window.history.pushState({}, ``, `/prefix/beta`);
    const link = anchor(`alpha`);
    const inner = link.querySelector(`span`);

    expect(fromClick(click(inner ?? link), `/prefix`, routeAt)).toBe(`/alpha`);
  });
});
