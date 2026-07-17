/* @vitest-environment node */
import { describe, expect, it } from "vitest";

import { RobokassaConfig } from "./RobokassaConfig";

const { allowsIp } = RobokassaConfig;

describe(`allowsIp`, () => {
  it(`accepts documented robokassa addresses`, () => {
    expect(allowsIp(`185.59.216.65`)).toBe(true);
    expect(allowsIp(`185.59.217.65`)).toBe(true);
  });

  it(`accepts ipv4-mapped ipv6 forms`, () => {
    expect(allowsIp(`::ffff:185.59.216.65`)).toBe(true);
  });

  it(`rejects other addresses`, () => {
    expect(allowsIp(`127.0.0.1`)).toBe(false);
    expect(allowsIp(`8.8.8.8`)).toBe(false);
  });
});
