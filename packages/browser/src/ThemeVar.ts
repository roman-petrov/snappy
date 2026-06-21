import { _ } from "@snappy/core";

const prefix = `--`;
const nameOf = (name: string) => (name.startsWith(prefix) ? name : `${prefix}${name}`);
const root = () => document.documentElement;

const read = (name: string, element: HTMLElement = root()) => {
  if (typeof document === `undefined`) {
    return ``;
  }

  return getComputedStyle(element).getPropertyValue(nameOf(name)).trim();
};

const ref = (name: string) => `var(${nameOf(name)})`;

const write = (name: string, value: string, element: HTMLElement = root()) =>
  element.style.setProperty(nameOf(name), value);

const remove = (name: string, element: HTMLElement = root()) => element.style.removeProperty(nameOf(name));

const mobileBreakpoint = () => {
  if (typeof window === `undefined`) {
    return 0;
  }

  return _.dec(read(`breakpoint-mobile`)) ?? 0;
};

const accent = (name: string) => ref(`color-${name.replaceAll(/[A-Z]/gu, letter => `-${letter.toLowerCase()}`)}`);

export const ThemeVar = { accent, mobileBreakpoint, read, ref, remove, write };
