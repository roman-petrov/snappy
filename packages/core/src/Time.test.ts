import { describe, expect, test } from "vitest";

import { Time } from "./Time";

const { build, constants, get, map, parts, set } = Time;

describe(`constants`, () => {
  test(`has correct constants`, () => {
    expect(constants).toMatchObject({
      day: {
        days: 1,
        hours: 24,
        microseconds: 86_400_000_000,
        milliseconds: 86_400_000,
        minutes: 1440,
        nanoseconds: 86_400_000_000_000,
        seconds: 86_400,
      },
      hour: {
        days: 0.041_666_666_666_666_664,
        hours: 1,
        microseconds: 3_600_000_000,
        milliseconds: 3_600_000,
        minutes: 60,
        nanoseconds: 3_600_000_000_000,
        seconds: 3600,
      },
      microsecond: {
        days: 1.157_407_407_407_407_4e-11,
        hours: 2.777_777_777_777_777_7e-10,
        microseconds: 1,
        milliseconds: 0.001,
        minutes: 1.666_666_666_666_666_7e-8,
        nanoseconds: 1000.000_000_000_000_1,
        seconds: 0.000_001,
      },
      millisecond: {
        days: 1.157_407_407_407_407_4e-8,
        hours: 2.777_777_777_777_777_6e-7,
        microseconds: 1000,
        milliseconds: 1,
        minutes: 0.000_016_666_666_666_666_667,
        nanoseconds: 1_000_000,
        seconds: 0.001,
      },
      minute: {
        days: 0.000_694_444_444_444_444_5,
        hours: 0.016_666_666_666_666_666,
        microseconds: 60_000_000,
        milliseconds: 60_000,
        minutes: 1,
        nanoseconds: 60_000_000_000,
        seconds: 60,
      },
      nanosecond: {
        days: 1.157_407_407_407_407_4e-14,
        hours: 2.777_777_777_777_777_4e-13,
        microseconds: 0.001,
        milliseconds: 0.000_001,
        minutes: 1.666_666_666_666_666_7e-11,
        nanoseconds: 1,
        seconds: 9.999_999_999_999_999e-10,
      },
      second: {
        days: 0.000_011_574_074_074_074_073,
        hours: 0.000_277_777_777_777_777_8,
        microseconds: 1_000_000,
        milliseconds: 1000,
        minutes: 0.016_666_666_666_666_666,
        nanoseconds: 1_000_000_000,
        seconds: 1,
      },
    });
  });
});

describe(`parse`, () => {
  test(`parses time`, () => {
    expect(parts(constants.nanosecond)).toStrictEqual({
      days: 0,
      hours: 0,
      microseconds: 0,
      milliseconds: 0,
      minutes: 0,
      nanoseconds: 1,
      seconds: 0,
    });
    expect(parts(constants.microsecond)).toStrictEqual({
      days: 0,
      hours: 0,
      microseconds: 1,
      milliseconds: 0,
      minutes: 0,
      nanoseconds: 0,
      seconds: 0,
    });
    expect(parts(constants.millisecond)).toStrictEqual({
      days: 0,
      hours: 0,
      microseconds: 0,
      milliseconds: 1,
      minutes: 0,
      nanoseconds: 0,
      seconds: 0,
    });
    expect(parts(constants.millisecond * 999)).toStrictEqual({
      days: 0,
      hours: 0,
      microseconds: 0,
      milliseconds: 999,
      minutes: 0,
      nanoseconds: 0,
      seconds: 0,
    });
    expect(parts(constants.millisecond * 1000)).toStrictEqual({
      days: 0,
      hours: 0,
      microseconds: 0,
      milliseconds: 0,
      minutes: 0,
      nanoseconds: 0,
      seconds: 1,
    });
    expect(parts(constants.minute * 100_000)).toStrictEqual({
      days: 69,
      hours: 10,
      microseconds: 0,
      milliseconds: 0,
      minutes: 40,
      nanoseconds: 0,
      seconds: 0,
    });
    expect(parts(3 * constants.hour + 70 * constants.minute)).toStrictEqual({
      days: 0,
      hours: 4,
      microseconds: 0,
      milliseconds: 0,
      minutes: 10,
      nanoseconds: 0,
      seconds: 0,
    });
    expect(parts(constants.day * Math.PI)).toStrictEqual({
      days: 3,
      hours: 3,
      microseconds: 270,
      milliseconds: 605,
      minutes: 23,
      nanoseconds: 158,
      seconds: 53,
    });
  });

  test(`removes sign for negative values`, () => {
    expect(parts(-1 * constants.day * Math.PI)).toStrictEqual({
      days: 3,
      hours: 3,
      microseconds: 270,
      milliseconds: 605,
      minutes: 23,
      nanoseconds: 158,
      seconds: 53,
    });
  });
});

describe(`get`, () => {
  test(`gets time parts`, () => {
    expect(get(constants.nanosecond, `nanoseconds`)).toBe(1);
    expect(get(constants.microsecond, `microseconds`)).toBe(1);
    expect(get(constants.millisecond, `milliseconds`)).toBe(1);
    expect(get(constants.second, `seconds`)).toBe(1);
    expect(get(constants.minute, `minutes`)).toBe(1);
    expect(get(constants.hour, `hours`)).toBe(1);
    expect(get(constants.day, `days`)).toBe(1);
    expect(get(42 * constants.day + 5 * constants.hour + 37 * constants.minute, `days`)).toBe(42);
    expect(get(42 * constants.day + 5 * constants.hour + 37 * constants.minute, `hours`)).toBe(5);
    expect(get(42 * constants.day + 5 * constants.hour + 37 * constants.minute, `minutes`)).toBe(37);
  });
});

describe(`set`, () => {
  test(`sets time parts`, () => {
    expect(set(constants.nanosecond, `nanoseconds`, 0)).toBe(0);
    expect(set(constants.second, `seconds`, 10)).toBe(10_000);
    expect(set(10 * constants.second, `minutes`, 10)).toBe(610_000);
    expect(set(10 * constants.minute, `seconds`, 10)).toBe(610_000);
    expect(set(constants.hour * 5 + constants.minute * 10, `hours`, 42)).toBe(151_800_000);

    expect(
      set(
        constants.day * 9 +
          constants.hour * 8 +
          constants.minute * 7 +
          constants.second * 6 +
          constants.millisecond * 5 +
          constants.microsecond * 4 +
          constants.nanosecond * 3,
        `minutes`,
        42,
      ),
    ).toBe(808_926_005.004_002);
  });
});

describe(`build`, () => {
  test(`returns zero for empty object`, () => {
    expect(build({})).toBe(0);
  });

  test(`builds time from parts`, () => {
    expect(build({ milliseconds: 42 })).toBe(42);
    expect(build({ milliseconds: 42, seconds: 10 })).toBe(10_042);
    expect(build({ days: 1, hours: 1, microseconds: 1, milliseconds: 1, minutes: 1, nanoseconds: 1, seconds: 1 })).toBe(
      90_061_001.001_001,
    );
    expect(
      build({ days: 42, hours: 42, microseconds: 42, milliseconds: 42, minutes: 42, nanoseconds: 42, seconds: 42 }),
    ).toBe(3_782_562_042.042_042);
  });
});

describe(`map`, () => {
  test(`maps time parts`, () => {
    expect(map(42 * constants.millisecond, `milliseconds`, value => value + 1)).toBe(43);
    expect(map(3 * constants.second + 42 * constants.millisecond, `seconds`, value => value - 1)).toBe(2042);
  });
});
