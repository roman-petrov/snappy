/* @vitest-environment node */
import { describe, expect, it } from "vitest";

import { YooKassaConfig } from "./YooKassaConfig";

const { allowsIp } = YooKassaConfig;

describe(`allowsIp`, () => {
  it(`accepts documented yookassa addresses`, () => {
    expect(allowsIp(`185.71.76.1`)).toBe(true);
    expect(allowsIp(`185.71.77.10`)).toBe(true);
    expect(allowsIp(`77.75.153.1`)).toBe(true);
    expect(allowsIp(`77.75.154.128`)).toBe(true);
    expect(allowsIp(`77.75.156.11`)).toBe(true);
    expect(allowsIp(`77.75.156.35`)).toBe(true);
    expect(allowsIp(`2a02:5180::1`)).toBe(true);
  });

  it(`accepts ipv4-mapped ipv6 forms`, () => {
    expect(allowsIp(`::ffff:77.75.156.11`)).toBe(true);
  });

  it(`rejects other addresses`, () => {
    expect(allowsIp(`127.0.0.1`)).toBe(false);
    expect(allowsIp(`8.8.8.8`)).toBe(false);
  });
});
