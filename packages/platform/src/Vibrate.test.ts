/* @vitest-environment jsdom */
import { describe, expect, it, vi } from "vitest";

const { bridgeAvailable, hapticImpact } = vi.hoisted(() => ({
  bridgeAvailable: { value: false },
  hapticImpact: vi.fn(),
}));

vi.mock(`./Bridge`, () => ({
  Bridge: {
    get available() {
      return bridgeAvailable.value;
    },
    hapticImpact,
  },
}));

import { Vibrate } from "./Vibrate";

const { trigger } = Vibrate;

describe(`trigger`, () => {
  it(`does nothing for none`, () => {
    bridgeAvailable.value = false;
    hapticImpact.mockReset();
    const vibrate = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate });

    trigger(`none`);

    expect(hapticImpact).not.toHaveBeenCalled();
    expect(vibrate).not.toHaveBeenCalled();
  });

  it(`uses Bridge when available`, () => {
    bridgeAvailable.value = true;
    hapticImpact.mockReset();
    const vibrate = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate });

    trigger(`confirm`);

    expect(hapticImpact).toHaveBeenCalledWith(`confirm`);
    expect(vibrate).not.toHaveBeenCalled();
  });

  it(`uses Vibration API confirm pattern when Bridge is unavailable`, () => {
    bridgeAvailable.value = false;
    hapticImpact.mockReset();
    const vibrate = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate });

    trigger(`confirm`);

    expect(hapticImpact).not.toHaveBeenCalled();
    expect(vibrate).toHaveBeenCalledWith(8);
  });

  it(`uses Vibration API segmentTick pattern when Bridge is unavailable`, () => {
    bridgeAvailable.value = false;
    const vibrate = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate });

    trigger(`segmentTick`);

    expect(vibrate).toHaveBeenCalledWith(3);
  });

  it(`uses Vibration API toggleOn pattern when Bridge is unavailable`, () => {
    bridgeAvailable.value = false;
    const vibrate = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate });

    trigger(`toggleOn`);

    expect(vibrate).toHaveBeenCalledWith(5);
  });

  it(`uses Vibration API toggleOff pattern when Bridge is unavailable`, () => {
    bridgeAvailable.value = false;
    const vibrate = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate });

    trigger(`toggleOff`);

    expect(vibrate).toHaveBeenCalledWith(2);
  });

  it(`does nothing for unused effects on web`, () => {
    bridgeAvailable.value = false;
    const vibrate = vi.fn();
    vi.stubGlobal(`navigator`, { vibrate });

    trigger(`longPress`);

    expect(vibrate).not.toHaveBeenCalled();
  });

  it(`does nothing when vibrate is unsupported`, () => {
    bridgeAvailable.value = false;
    vi.stubGlobal(`navigator`, {});

    expect(() => trigger(`confirm`)).not.toThrow();
  });
});
