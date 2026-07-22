/* @vitest-environment jsdom */
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useStageInsets } from "./useStageInsets";

const shellSafe = `env(safe-area-inset-bottom, 0px)`;
const edgeSm = `token(space-sm)`;
const edgeMd = `token(space-md)`;

const { ime, mobile, pageSafe } = vi.hoisted(() => ({
  ime: `ime-fixture`,
  mobile: { value: true },
  pageSafe: `page-safe-fixture`,
}));

vi.mock(`@snappy/browser`, () => ({ Keyboard: { height: ime, safe: pageSafe } }));

vi.mock(`@snappy/hooks`, () => ({
  ThemeVar: { ref: (name: string) => `token(${name})` },
  useIsMobile: () => mobile.value,
}));

describe(`useStageInsets`, () => {
  it(`dockPad is edge plus page safe`, () => {
    mobile.value = true;

    const { result } = renderHook(() => useStageInsets());

    expect(result.current.insets.dockPad).toBe(`calc(${edgeSm} + ${pageSafe})`);
  });

  it(`uses desktop edge`, () => {
    mobile.value = false;

    const { result } = renderHook(() => useStageInsets());

    expect(result.current.insets.dockPad).toBe(`calc(${edgeMd} + ${pageSafe})`);
    expect(result.current.insets.shell.scrollPad).toBe(`calc(${shellSafe} + ${edgeMd})`);
  });

  describe(`page`, () => {
    it(`fade without chrome is safe plus ime`, () => {
      mobile.value = true;

      const { result } = renderHook(() => useStageInsets());

      expect(result.current.insets.page.fadeMinHeight).toBe(`calc(${pageSafe} + ${ime})`);
    });

    it(`fade with chrome adds edge`, () => {
      mobile.value = true;

      const { result } = renderHook(() => useStageInsets(undefined, 42));

      expect(result.current.insets.page.fadeMinHeight).toBe(`calc(${edgeSm} + ${pageSafe} + ${ime})`);
    });

    it(`scrollPad without chrome includes ime`, () => {
      mobile.value = true;

      const { result } = renderHook(() => useStageInsets());

      expect(result.current.insets.page.scrollPad).toBe(`calc(${pageSafe} + ${edgeSm} + ${ime})`);
    });

    it(`scrollPad with chrome stacks height between edges`, () => {
      mobile.value = true;

      const { result } = renderHook(() => useStageInsets(undefined, 42));

      expect(result.current.insets.page.scrollPad).toBe(`calc(${pageSafe} + ${edgeSm} + 42px + ${edgeSm} + ${ime})`);
    });
  });

  describe(`shell`, () => {
    it(`fade without chrome is bare safe`, () => {
      mobile.value = true;

      const { result } = renderHook(() => useStageInsets());

      expect(result.current.insets.shell.fadeMinHeight).toBe(shellSafe);
    });

    it(`fade with chrome adds edge and ignores ime`, () => {
      mobile.value = true;

      const { result } = renderHook(() => useStageInsets(42));

      expect(result.current.insets.shell.fadeMinHeight).toBe(`calc(${edgeSm} + ${shellSafe})`);
    });

    it(`scrollPad without chrome ignores ime`, () => {
      mobile.value = true;

      const { result } = renderHook(() => useStageInsets());

      expect(result.current.insets.shell.scrollPad).toBe(`calc(${shellSafe} + ${edgeSm})`);
    });

    it(`scrollPad with chrome stacks height between edges`, () => {
      mobile.value = true;

      const { result } = renderHook(() => useStageInsets(42));

      expect(result.current.insets.shell.scrollPad).toBe(`calc(${shellSafe} + ${edgeSm} + 42px + ${edgeSm})`);
    });
  });
});
