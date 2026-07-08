import { describe, expect, it } from "vitest";

import { Env } from "./Env";

describe(`Env`, () => {
  it(`matches import.meta.env.DEV`, () => {
    expect(Env.dev()).toBe(import.meta.env.DEV);
  });
});
