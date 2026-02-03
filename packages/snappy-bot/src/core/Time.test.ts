import { describe, expect, test } from "bun:test";

import { Time } from "./Time";

describe(`Time`, () => {
  test(`should export secondsPerMinute as 60`, () => {
    expect(Time.secondsPerMinute).toBe(60);
  });

  test(`should export minutesPerHour as 60`, () => {
    expect(Time.minutesPerHour).toBe(60);
  });

  test(`should export millisecondsPerSecond as 1000`, () => {
    expect(Time.millisecondsPerSecond).toBe(1000);
  });

  test(`should export hourInMs as 3600000 (60 * 60 * 1000)`, () => {
    expect(Time.hourInMs).toBe(60 * 60 * 1000);
    expect(Time.hourInMs).toBe(3_600_000);
  });

  test(`should export dayInMs as 86400000 (24 * hourInMs)`, () => {
    expect(Time.dayInMs).toBe(24 * Time.hourInMs);
    expect(Time.dayInMs).toBe(86_400_000);
  });

  test(`should have correct relationship between time units`, () => {
    expect(Time.hourInMs).toBe(Time.secondsPerMinute * Time.minutesPerHour * Time.millisecondsPerSecond);
    expect(Time.dayInMs).toBe(24 * Time.hourInMs);
  });
});
