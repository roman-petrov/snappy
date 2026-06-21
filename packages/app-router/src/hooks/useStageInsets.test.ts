import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useStageInsets } from "./useStageInsets";

const safe = `env(safe-area-inset-bottom, 0px)`;
const edgeSm = `var(--space-sm)`;
const edgeMd = `var(--space-md)`;
const { bridgeState, mobile } = vi.hoisted(() => ({ bridgeState: { available: false }, mobile: { value: true } }));

vi.mock(`@snappy/hooks`, () => ({
  ThemeVar: { ref: (name: string) => `var(--${name})` },
  useIsMobile: () => mobile.value,
}));

vi.mock(import(`@snappy/platform`), () => ({
  Bridge: {
    get available() {
      return bridgeState.available;
    },
    copyHtml: vi.fn(),
    copyImage: vi.fn(),
    hapticImpact: vi.fn(),
    keyboardChangedEvent: `snappy:keyboard-changed` as const,
    screenCornerRadius: vi.fn(() => 0),
    setBarStyle: vi.fn(),
    shareHtml: vi.fn(),
    shareImage: vi.fn(),
    systemDark: vi.fn(),
    systemThemeChangedEvent: `snappy:system-theme-changed` as const,
  },
  Vibrate: { trigger: vi.fn() },
}));

describe(`useStageInsets`, () => {
  it(`uses mobile edge`, () => {
    bridgeState.available = false;
    mobile.value = true;

    const { result } = renderHook(() => useStageInsets());

    expect(result.current.insets.shell.scrollPad).toBe(`calc(${safe} + ${edgeSm})`);
  });

  it(`uses desktop edge`, () => {
    bridgeState.available = false;
    mobile.value = false;

    const { result } = renderHook(() => useStageInsets());

    expect(result.current.insets.shell.scrollPad).toBe(`calc(${safe} + ${edgeMd})`);
  });

  it(`shell fade with chrome equals dockPad`, () => {
    bridgeState.available = false;
    mobile.value = true;

    const { result } = renderHook(() => useStageInsets(48));

    expect(result.current.insets.shell.fadeMinHeight).toBe(`calc(${edgeSm} + ${safe})`);
  });

  it(`shell fade without chrome equals safe`, () => {
    bridgeState.available = false;
    const { result } = renderHook(() => useStageInsets());

    expect(result.current.insets.shell.fadeMinHeight).toBe(safe);
  });

  it(`page fade with keyboard uses edge only`, () => {
    bridgeState.available = true;
    mobile.value = true;

    const { result } = renderHook(() => useStageInsets(undefined, 48));

    act(() => {
      window.dispatchEvent(new CustomEvent(`snappy:keyboard-changed`, { detail: { open: true } }));
    });

    expect(result.current.insets.page.fadeMinHeight).toBe(`calc(${edgeSm} + 0px)`);
  });

  it(`page scrollPad with chrome height`, () => {
    bridgeState.available = false;
    mobile.value = true;

    const { result } = renderHook(() => useStageInsets(undefined, 48));

    expect(result.current.insets.page.scrollPad).toBe(`calc(${safe} + ${edgeSm} + 48px + ${edgeSm})`);
  });
});
