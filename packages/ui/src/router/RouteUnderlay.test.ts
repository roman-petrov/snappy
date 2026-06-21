import { describe, expect, it } from "vitest";

import { RouteUnderlay } from "./RouteUnderlay";

describe(`RouteUnderlay`, () => {
  it(`dims content when cover is settled`, () => {
    expect(RouteUnderlay.stage(`cover`)).toMatchObject({ contentDimmed: true, exiting: false, shellPassive: true });
  });

  it(`keeps underlay visible during overlay enter`, () => {
    expect(RouteUnderlay.stage(`cover`, `overlay-forward`)).toMatchObject({
      contentDimmed: false,
      exiting: false,
      shellPassive: true,
    });
  });

  it(`keeps underlay dimmed during overlay exit`, () => {
    expect(RouteUnderlay.stage(undefined, `overlay-back`)).toMatchObject({
      contentDimmed: true,
      exiting: true,
      shellPassive: true,
    });
  });

  it(`leaves tab routes undimmed`, () => {
    expect(RouteUnderlay.stage(undefined)).toMatchObject({ contentDimmed: false, exiting: false, shellPassive: false });
  });
});
