/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
import { ObjectValue } from "./ObjectValue";
import { Stats } from "./Stats";

const nanosecond = 1 / 1_000_000;
const microsecond = 1 / 1000;
const millisecond = 1;
const second = 1000 * millisecond;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

const durations = [
  [`day`, day],
  [`hour`, hour],
  [`minute`, minute],
  [`second`, second],
  [`millisecond`, millisecond],
  [`microsecond`, microsecond],
  [`nanosecond`, nanosecond],
] as const;

const unitsKey = (unit: TimeUnit): TimeUnits => `${unit}s`;

const constants = ObjectValue.fromEntries(
  durations.map(([unit, time]) => [
    unit,
    Object.assign(
      time,
      ObjectValue.fromEntries(durations.map(([duration, durationTime]) => [unitsKey(duration), time / durationTime])),
    ),
  ]),
);

export type Time = Record<TimeUnits, number>;

export type TimeUnit = (typeof durations)[number][0];

export type TimeUnits = `${TimeUnit}s`;

const parts = (value: number): Time => {
  const result: Partial<Time> = {};
  let remainingTime = Math.abs(value);
  for (const [unit, unitTime] of durations) {
    result[unitsKey(unit)] = Math.floor(remainingTime / unitTime);
    remainingTime %= unitTime;
  }

  return result as Time;
};

const build = (value: Partial<Time>) =>
  Stats.sum(durations.map(([unit, unitTime]) => (value[unitsKey(unit)] ?? 0) * unitTime)) ?? 0;

const get = (value: number, units: TimeUnits) => parts(value)[units];
const set = (value: number, units: TimeUnits, newValue: number) => build({ ...parts(value), [units]: newValue });

const map = (value: number, units: TimeUnits, update: (value: number) => number) =>
  set(value, units, update(get(value, units)));

const daysInWeek = 7;
const daysInYear = 365;

export const Time = { build, constants, daysInWeek, daysInYear, get, map, parts, set };
