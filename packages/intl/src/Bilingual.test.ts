import { describe, expect, it } from "vitest";

import { Bilingual } from "./Bilingual";

const { binary, named, pick, running, status } = Bilingual;

describe(`pick`, () => {
  it(`returns English for en locale`, () => {
    expect(pick(`en`, [`Hello`, `Привет`])).toBe(`Hello`);
  });

  it(`returns Russian for ru locale`, () => {
    expect(pick(`ru`, [`Hello`, `Привет`])).toBe(`Привет`);
  });
});

describe(`binary`, () => {
  it(`picks on or off label once by locale`, () => {
    expect(binary(`en`, true, [`yes`, `да`], [`no`, `нет`])).toBe(`yes`);
    expect(binary(`ru`, false, [`yes`, `да`], [`no`, `нет`])).toBe(`нет`);
  });
});

describe(`named`, () => {
  it(`picks from en/ru object`, () => {
    expect(named(`en`, { en: `Hello`, ru: `Привет` })).toBe(`Hello`);
    expect(named(`ru`, { en: `Hello`, ru: `Привет` })).toBe(`Привет`);
  });
});

describe(`running`, () => {
  it(`returns label only while running`, () => {
    expect(running(`en`, true, [`Reading`, `Читаю`])).toBe(`Reading`);
    expect(running(`ru`, false, [`Reading`, `Читаю`])).toBe(``);
  });
});

describe(`status`, () => {
  it(`picks running or done label by locale`, () => {
    expect(status(`en`, true, [`Reading`, `Читаю`], [`Read`, `Прочитал`])).toBe(`Reading`);
    expect(status(`ru`, false, [`Reading`, `Читаю`], [`Read`, `Прочитал`])).toBe(`Прочитал`);
  });
});
