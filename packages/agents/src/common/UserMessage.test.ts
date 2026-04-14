import { describe, expect, it } from "vitest";

import type { StaticFormPlan } from "./Meta";

import { UserMessage, type UserMessageBuildInput } from "./UserMessage";

const { build } = UserMessage;

describe(`build`, () => {
  it(`returns trimmed main prompt only when the plan has no fields`, () => {
    const input: UserMessageBuildInput = {
      answers: {},
      locale: `en`,
      mainPrompt: `  hello  `,
      plan: { fields: [] },
    };

    expect(build(input)).toBe(`hello`);
  });

  it(`appends toggle line for en locale`, () => {
    const plan: StaticFormPlan = { fields: [{ id: `x`, kind: `toggle`, label: `Flag` }] };
    const input: UserMessageBuildInput = { answers: { x: true }, locale: `en`, mainPrompt: `Hi`, plan };

    expect(build(input)).toBe([`Hi`, ``, `- Flag: yes`].join(`\n`));
  });

  it(`appends toggle line for ru locale`, () => {
    const plan: StaticFormPlan = { fields: [{ id: `x`, kind: `toggle`, label: `Флаг` }] };
    const input: UserMessageBuildInput = { answers: { x: false }, locale: `ru`, mainPrompt: `Привет`, plan };

    expect(build(input)).toBe([`Привет`, ``, `- Флаг: нет`].join(`\n`));
  });

  it(`renders empty text field with em dash`, () => {
    const plan: StaticFormPlan = { fields: [{ id: `note`, kind: `text`, label: `Note` }] };
    const input: UserMessageBuildInput = { answers: { note: `` }, locale: `en`, mainPrompt: `Head`, plan };

    expect(build(input)).toBe([`Head`, ``, `- Note`, `—`].join(`\n`));
  });

  it(`renders text field with body`, () => {
    const plan: StaticFormPlan = { fields: [{ id: `note`, kind: `text`, label: `Note` }] };
    const input: UserMessageBuildInput = { answers: { note: `  body  ` }, locale: `en`, mainPrompt: `Head`, plan };

    expect(build(input)).toBe([`Head`, ``, `- Note`, ``, `body`].join(`\n`));
  });

  it(`resolves tabs_single option label`, () => {
    const plan: StaticFormPlan = {
      fields: [{ id: `mode`, kind: `tabs_single`, label: `Mode`, options: [{ label: `Fast`, value: `f` }] }],
    };

    const input: UserMessageBuildInput = { answers: { mode: `f` }, locale: `en`, mainPrompt: `Go`, plan };

    expect(build(input)).toBe([`Go`, ``, `- Mode = Fast`].join(`\n`));
  });

  it(`lists tabs_multi selections`, () => {
    const plan: StaticFormPlan = {
      fields: [
        {
          id: `tags`,
          kind: `tabs_multi`,
          label: `Tags`,
          options: [
            { label: `One`, value: `1` },
            { label: `Two`, value: `2` },
          ],
        },
      ],
    };

    const input: UserMessageBuildInput = { answers: { tags: [`1`, `2`] }, locale: `en`, mainPrompt: `X`, plan };

    expect(build(input)).toBe([`X`, ``, `- Tags = One`, `- Tags = Two`].join(`\n`));
  });

  it(`omits text field when omitWhenEmpty and value is empty`, () => {
    const plan: StaticFormPlan = {
      fields: [{ id: `opt`, kind: `text`, label: `Opt`, omitWhenEmpty: true }],
    };

    const input: UserMessageBuildInput = { answers: { opt: `   ` }, locale: `en`, mainPrompt: `Only`, plan };

    expect(build(input)).toBe(`Only`);
  });
});
