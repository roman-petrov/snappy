/* eslint-disable unicorn/prefer-string-repeat */
import { describe, expect, it } from "vitest";

import { StaticAgentPrompt } from "./StaticAgentPrompt";

describe(`StaticAgentPrompt`, () => {
  it(`returns only trimmed instruction when form has no fields`, () => {
    expect(
      StaticAgentPrompt({ answers: {}, locale: `en`, mainPrompt: `  Improve this text  `, plan: { fields: [] } }),
    ).toMatchInlineSnapshot(`"Improve this text"`);
  });

  it(`renders realistic mixed form in stable field order`, () => {
    expect(
      StaticAgentPrompt({
        answers: { emoji: true, points: [`price`, `support`], source: `  We launch next Monday.  `, tone: `friendly` },
        locale: `en`,
        mainPrompt: `Prepare message`,
        plan: {
          fields: [
            {
              id: `tone`,
              kind: `single_choice`,
              label: { emoji: `🔹`, text: `Tone` },
              options: [{ label: { emoji: `🔹`, text: `Friendly` }, value: `friendly` }],
            },
            {
              id: `points`,
              kind: `multiple_choice`,
              label: { emoji: `🔹`, text: `Key points` },
              options: [
                { label: { emoji: `🔹`, text: `Price` }, value: `price` },
                { label: { emoji: `🔹`, text: `Support` }, value: `support` },
              ],
            },
            { id: `emoji`, kind: `binary_choice`, label: { emoji: `🔹`, text: `Use emoji` } },
            { id: `source`, kind: `text_input`, label: { emoji: `🔹`, text: `Source text` } },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Prepare message

      - Tone: Friendly
      - Key points: Price, Support
      - Use emoji: yes
      - Source text: "We launch next Monday.""
    `);
  });

  it(`uses custom prompt for single_choice selected option`, () => {
    expect(
      StaticAgentPrompt({
        answers: { tone: `friendly` },
        locale: `en`,
        mainPrompt: `Draft customer reply`,
        plan: {
          fields: [
            {
              id: `tone`,
              kind: `single_choice`,
              label: { emoji: `🔹`, text: `Tone` },
              options: [
                { label: { emoji: `🔹`, text: `Friendly` }, prompt: `warm and conversational`, value: `friendly` },
                { label: { emoji: `🔹`, text: `Formal` }, value: `formal` },
              ],
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Draft customer reply

      - Tone: warm and conversational"
    `);
  });

  it(`omits single_choice when option is unknown`, () => {
    expect(
      StaticAgentPrompt({
        answers: { tone: `casual` },
        locale: `en`,
        mainPrompt: `Draft reply`,
        plan: {
          fields: [
            {
              id: `tone`,
              kind: `single_choice`,
              label: { emoji: `🔹`, text: `Tone` },
              options: [{ label: { emoji: `🔹`, text: `Friendly` }, value: `friendly` }],
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`"Draft reply"`);
  });

  it(`uses custom prompts for selected multiple_choice options`, () => {
    expect(
      StaticAgentPrompt({
        answers: { focus: [`price`, `support`] },
        locale: `en`,
        mainPrompt: `Prepare proposal summary`,
        plan: {
          fields: [
            {
              id: `focus`,
              kind: `multiple_choice`,
              label: { emoji: `🔹`, text: `Focus areas` },
              options: [
                { label: { emoji: `🔹`, text: `Price` }, prompt: `clear pricing`, value: `price` },
                { label: { emoji: `🔹`, text: `Support` }, prompt: `support availability`, value: `support` },
                { label: { emoji: `🔹`, text: `Timeline` }, value: `timeline` },
              ],
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Prepare proposal summary

      - Focus areas: clear pricing, support availability"
    `);
  });

  it(`ignores unknown values in multiple_choice`, () => {
    expect(
      StaticAgentPrompt({
        answers: { focus: [`unknown`, `support`] },
        locale: `en`,
        mainPrompt: `Prepare proposal summary`,
        plan: {
          fields: [
            {
              id: `focus`,
              kind: `multiple_choice`,
              label: { emoji: `🔹`, text: `Focus areas` },
              options: [
                { label: { emoji: `🔹`, text: `Price` }, value: `price` },
                { label: { emoji: `🔹`, text: `Support` }, value: `support` },
              ],
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Prepare proposal summary

      - Focus areas: Support"
    `);
  });

  it(`uses custom promptOn and promptOff for binary_choice`, () => {
    expect(
      StaticAgentPrompt({
        answers: { emoji: true },
        locale: `en`,
        mainPrompt: `Write social caption`,
        plan: {
          fields: [
            {
              id: `emoji`,
              kind: `binary_choice`,
              label: { emoji: `🔹`, text: `Emoji usage` },
              promptOff: `avoid emojis`,
              promptOn: `use emojis moderately`,
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Write social caption

      - Emoji usage: use emojis moderately"
    `);
    expect(
      StaticAgentPrompt({
        answers: { emoji: false },
        locale: `en`,
        mainPrompt: `Write social caption`,
        plan: {
          fields: [
            {
              id: `emoji`,
              kind: `binary_choice`,
              label: { emoji: `🔹`, text: `Emoji usage` },
              promptOff: `avoid emojis`,
              promptOn: `use emojis moderately`,
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Write social caption

      - Emoji usage: avoid emojis"
    `);
  });

  it(`falls back to yes/no when binary_choice prompts are empty`, () => {
    expect(
      StaticAgentPrompt({
        answers: { emoji: true },
        locale: `en`,
        mainPrompt: `Write social caption`,
        plan: {
          fields: [
            {
              id: `emoji`,
              kind: `binary_choice`,
              label: { emoji: `🔹`, text: `Emoji usage` },
              promptOff: ``,
              promptOn: ``,
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Write social caption

      - Emoji usage: yes"
    `);
    expect(
      StaticAgentPrompt({
        answers: { emoji: false },
        locale: `ru`,
        mainPrompt: `Подпись`,
        plan: {
          fields: [
            { id: `emoji`, kind: `binary_choice`, label: { emoji: `🔹`, text: `Эмодзи` }, promptOff: ``, promptOn: `` },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Подпись

      - Эмодзи: нет"
    `);
  });

  it(`keeps escaped quotes in text values`, () => {
    expect(
      StaticAgentPrompt({
        answers: { source: `She said "launch now"` },
        locale: `en`,
        mainPrompt: `Rewrite in simpler English`,
        plan: { fields: [{ id: `source`, kind: `text_input`, label: { emoji: `🔹`, text: `Source text` } }] },
      }),
    ).toMatchInlineSnapshot(`
      "Rewrite in simpler English

      - Source text: "She said \\"launch now\\"""
    `);
  });

  it(`omits text field when value is empty`, () => {
    expect(
      StaticAgentPrompt({
        answers: { source: `` },
        locale: `en`,
        mainPrompt: `Rewrite in simpler English`,
        plan: { fields: [{ id: `source`, kind: `text_input`, label: { emoji: `🔹`, text: `Source text` } }] },
      }),
    ).toMatchInlineSnapshot(`"Rewrite in simpler English"`);
  });

  it(`omits text field when value is undefined`, () => {
    expect(
      StaticAgentPrompt({
        answers: { source: undefined },
        locale: `en`,
        mainPrompt: `Rewrite in simpler English`,
        plan: { fields: [{ id: `source`, kind: `text_input`, label: { emoji: `🔹`, text: `Source text` } }] },
      }),
    ).toMatchInlineSnapshot(`"Rewrite in simpler English"`);
  });

  it(`omits single_choice when value is missing`, () => {
    expect(
      StaticAgentPrompt({
        answers: {},
        locale: `en`,
        mainPrompt: `Draft reply`,
        plan: {
          fields: [
            {
              id: `tone`,
              kind: `single_choice`,
              label: { emoji: `🔹`, text: `Tone` },
              options: [{ label: { emoji: `🔹`, text: `Friendly` }, value: `friendly` }],
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`"Draft reply"`);
  });

  it(`omits multiple_choice when no options are selected`, () => {
    expect(
      StaticAgentPrompt({
        answers: { points: [] },
        locale: `en`,
        mainPrompt: `Prepare summary`,
        plan: {
          fields: [
            {
              id: `points`,
              kind: `multiple_choice`,
              label: { emoji: `🔹`, text: `Key points` },
              options: [{ label: { emoji: `🔹`, text: `Price` }, value: `price` }],
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`"Prepare summary"`);
  });

  it(`omits binary_choice when value is missing`, () => {
    expect(
      StaticAgentPrompt({
        answers: {},
        locale: `en`,
        mainPrompt: `Write a short Instagram caption`,
        plan: { fields: [{ id: `emoji`, kind: `binary_choice`, label: { emoji: `🔹`, text: `Use emoji` } }] },
      }),
    ).toMatchInlineSnapshot(`"Write a short Instagram caption"`);
  });

  it(`returns only bullets when mainPrompt is absent`, () => {
    expect(
      StaticAgentPrompt({
        answers: { tone: `friendly` },
        locale: `en`,
        plan: {
          fields: [
            {
              id: `tone`,
              kind: `single_choice`,
              label: { emoji: `🔹`, text: `Tone` },
              options: [{ label: { emoji: `🔹`, text: `Friendly` }, value: `friendly` }],
            },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`"- Tone: Friendly"`);
  });

  it(`builds a realistic large brief from a full mixed plan`, () => {
    expect(
      StaticAgentPrompt({
        answers: {
          audience: `new`,
          briefFile: undefined,
          channels: [`email`, `blog`, `unknown`],
          cta: `  Start your free trial today.  `,
          emoji: true,
          extra: `   `,
          html: false,
          mustInclude: [`pricing`, `support`],
          source: `  We are launching a new plan next Monday. Keep it clear and short.  `,
          tone: `professional`,
        },
        locale: `en`,
        mainPrompt: `Create final campaign brief for launch`,
        plan: {
          fields: [
            {
              id: `audience`,
              kind: `single_choice`,
              label: { emoji: `🔹`, text: `Audience` },
              options: [
                {
                  label: { emoji: `🔹`, text: `New users` },
                  prompt: `people trying the product for the first time`,
                  value: `new`,
                },
                { label: { emoji: `🔹`, text: `Existing users` }, value: `existing` },
              ],
            },
            {
              id: `channels`,
              kind: `multiple_choice`,
              label: { emoji: `🔹`, text: `Channels` },
              options: [
                { label: { emoji: `🔹`, text: `Email` }, prompt: `email campaign`, value: `email` },
                { label: { emoji: `🔹`, text: `Blog` }, prompt: `blog post`, value: `blog` },
                { label: { emoji: `🔹`, text: `In-app` }, value: `in-app` },
              ],
            },
            {
              id: `mustInclude`,
              kind: `multiple_choice`,
              label: { emoji: `🔹`, text: `Must include` },
              options: [
                { label: { emoji: `🔹`, text: `Pricing` }, prompt: `clear pricing details`, value: `pricing` },
                { label: { emoji: `🔹`, text: `Timeline` }, prompt: `launch timeline`, value: `timeline` },
                { label: { emoji: `🔹`, text: `Support` }, value: `support` },
              ],
            },
            {
              id: `tone`,
              kind: `single_choice`,
              label: { emoji: `🔹`, text: `Tone` },
              options: [
                { label: { emoji: `🔹`, text: `Friendly` }, value: `friendly` },
                {
                  label: { emoji: `🔹`, text: `Professional` },
                  prompt: `professional and confident`,
                  value: `professional`,
                },
              ],
            },
            {
              id: `emoji`,
              kind: `binary_choice`,
              label: { emoji: `🔹`, text: `Emoji usage` },
              promptOff: `no emojis`,
              promptOn: `use emojis moderately`,
            },
            {
              id: `html`,
              kind: `binary_choice`,
              label: { emoji: `🔹`, text: `HTML formatting` },
              promptOff: ``,
              promptOn: ``,
            },
            { id: `source`, kind: `text_input`, label: { emoji: `🔹`, text: `Source text` } },
            { id: `extra`, kind: `text_input`, label: { emoji: `🔹`, text: `Extra constraints` }, omitWhenEmpty: true },
            { id: `cta`, kind: `text_input`, label: { emoji: `🔹`, text: `CTA line` } },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Create final campaign brief for launch

      - Audience: people trying the product for the first time
      - Channels: email campaign, blog post
      - Must include: clear pricing details, Support
      - Tone: professional and confident
      - Emoji usage: use emojis moderately
      - HTML formatting: no
      - Source text: "We are launching a new plan next Monday. Keep it clear and short."
      - CTA line: "Start your free trial today.""
    `);
  });
});
