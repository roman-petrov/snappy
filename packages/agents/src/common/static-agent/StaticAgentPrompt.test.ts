import { describe, expect, it } from "vitest";

import { StaticAgentPrompt } from "./StaticAgentPrompt";

describe(`StaticAgentPrompt`, () => {
  it(`returns only trimmed instruction when form has no fields`, () => {
    expect(
      StaticAgentPrompt({ answers: {}, mainPrompt: `  Improve this text  `, plan: { fields: [] } }),
    ).toMatchInlineSnapshot(`"Improve this text"`);
  });

  it(`renders realistic mixed form in stable field order`, () => {
    expect(
      StaticAgentPrompt({
        answers: { emoji: true, points: [`price`, `support`], source: `  We launch next Monday.  `, tone: `friendly` },
        mainPrompt: `Prepare message`,
        plan: {
          fields: [
            { id: `tone`, kind: `tabs_single`, label: `Tone`, options: [{ label: `Friendly`, value: `friendly` }] },
            {
              id: `points`,
              kind: `tabs_multi`,
              label: `Key points`,
              options: [
                { label: `Price`, value: `price` },
                { label: `Support`, value: `support` },
              ],
            },
            { id: `emoji`, kind: `toggle`, label: `Use emoji` },
            { id: `source`, kind: `text`, label: `Source text` },
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

  it(`uses custom prompt for tabs_single selected option`, () => {
    expect(
      StaticAgentPrompt({
        answers: { tone: `friendly` },
        mainPrompt: `Draft customer reply`,
        plan: {
          fields: [
            {
              id: `tone`,
              kind: `tabs_single`,
              label: `Tone`,
              options: [
                { label: `Friendly`, prompt: `warm and conversational`, value: `friendly` },
                { label: `Formal`, value: `formal` },
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

  it(`falls back to raw tabs_single value when option is unknown`, () => {
    expect(
      StaticAgentPrompt({
        answers: { tone: `casual` },
        mainPrompt: `Draft reply`,
        plan: {
          fields: [
            { id: `tone`, kind: `tabs_single`, label: `Tone`, options: [{ label: `Friendly`, value: `friendly` }] },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`
      "Draft reply

      - Tone: casual"
    `);
  });

  it(`uses custom prompts for selected tabs_multi options`, () => {
    expect(
      StaticAgentPrompt({
        answers: { focus: [`price`, `support`] },
        mainPrompt: `Prepare proposal summary`,
        plan: {
          fields: [
            {
              id: `focus`,
              kind: `tabs_multi`,
              label: `Focus areas`,
              options: [
                { label: `Price`, prompt: `clear pricing`, value: `price` },
                { label: `Support`, prompt: `support availability`, value: `support` },
                { label: `Timeline`, value: `timeline` },
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

  it(`ignores unknown values in tabs_multi`, () => {
    expect(
      StaticAgentPrompt({
        answers: { focus: [`unknown`, `support`] },
        mainPrompt: `Prepare proposal summary`,
        plan: {
          fields: [
            {
              id: `focus`,
              kind: `tabs_multi`,
              label: `Focus areas`,
              options: [
                { label: `Price`, value: `price` },
                { label: `Support`, value: `support` },
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

  it(`uses custom promptOn and promptOff for toggle`, () => {
    expect(
      StaticAgentPrompt({
        answers: { emoji: true },
        mainPrompt: `Write social caption`,
        plan: {
          fields: [
            {
              id: `emoji`,
              kind: `toggle`,
              label: `Emoji usage`,
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
        mainPrompt: `Write social caption`,
        plan: {
          fields: [
            {
              id: `emoji`,
              kind: `toggle`,
              label: `Emoji usage`,
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

  it(`falls back to yes/no when toggle prompts are empty`, () => {
    expect(
      StaticAgentPrompt({
        answers: { emoji: true },
        mainPrompt: `Write social caption`,
        plan: { fields: [{ id: `emoji`, kind: `toggle`, label: `Emoji usage`, promptOff: ``, promptOn: `` }] },
      }),
    ).toMatchInlineSnapshot(`
      "Write social caption

      - Emoji usage: yes"
    `);
  });

  it(`keeps escaped quotes in text values`, () => {
    expect(
      StaticAgentPrompt({
        answers: { source: `She said "launch now"` },
        mainPrompt: `Rewrite in simpler English`,
        plan: { fields: [{ id: `source`, kind: `text`, label: `Source text` }] },
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
        mainPrompt: `Rewrite in simpler English`,
        plan: { fields: [{ id: `source`, kind: `text`, label: `Source text` }] },
      }),
    ).toMatchInlineSnapshot(`"Rewrite in simpler English"`);
  });

  it(`omits text field when value is undefined`, () => {
    expect(
      StaticAgentPrompt({
        answers: { source: undefined },
        mainPrompt: `Rewrite in simpler English`,
        plan: { fields: [{ id: `source`, kind: `text`, label: `Source text` }] },
      }),
    ).toMatchInlineSnapshot(`"Rewrite in simpler English"`);
  });

  it(`omits tabs_single when value is missing`, () => {
    expect(
      StaticAgentPrompt({
        answers: {},
        mainPrompt: `Draft reply`,
        plan: {
          fields: [
            { id: `tone`, kind: `tabs_single`, label: `Tone`, options: [{ label: `Friendly`, value: `friendly` }] },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`"Draft reply"`);
  });

  it(`omits tabs_multi when no options are selected`, () => {
    expect(
      StaticAgentPrompt({
        answers: { points: [] },
        mainPrompt: `Prepare summary`,
        plan: {
          fields: [
            { id: `points`, kind: `tabs_multi`, label: `Key points`, options: [{ label: `Price`, value: `price` }] },
          ],
        },
      }),
    ).toMatchInlineSnapshot(`"Prepare summary"`);
  });

  it(`omits toggle when value is missing`, () => {
    expect(
      StaticAgentPrompt({
        answers: {},
        mainPrompt: `Write a short Instagram caption`,
        plan: { fields: [{ id: `emoji`, kind: `toggle`, label: `Use emoji` }] },
      }),
    ).toMatchInlineSnapshot(`"Write a short Instagram caption"`);
  });

  it(`returns only bullets when mainPrompt is absent`, () => {
    expect(
      StaticAgentPrompt({
        answers: { tone: `friendly` },
        plan: {
          fields: [
            { id: `tone`, kind: `tabs_single`, label: `Tone`, options: [{ label: `Friendly`, value: `friendly` }] },
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
        mainPrompt: `Create final campaign brief for launch`,
        plan: {
          fields: [
            {
              id: `audience`,
              kind: `tabs_single`,
              label: `Audience`,
              options: [
                { label: `New users`, prompt: `people trying the product for the first time`, value: `new` },
                { label: `Existing users`, value: `existing` },
              ],
            },
            {
              id: `channels`,
              kind: `tabs_multi`,
              label: `Channels`,
              options: [
                { label: `Email`, prompt: `email campaign`, value: `email` },
                { label: `Blog`, prompt: `blog post`, value: `blog` },
                { label: `In-app`, value: `inapp` },
              ],
            },
            {
              id: `mustInclude`,
              kind: `tabs_multi`,
              label: `Must include`,
              options: [
                { label: `Pricing`, prompt: `clear pricing details`, value: `pricing` },
                { label: `Timeline`, prompt: `launch timeline`, value: `timeline` },
                { label: `Support`, value: `support` },
              ],
            },
            {
              id: `tone`,
              kind: `tabs_single`,
              label: `Tone`,
              options: [
                { label: `Friendly`, value: `friendly` },
                { label: `Professional`, prompt: `professional and confident`, value: `professional` },
              ],
            },
            {
              id: `emoji`,
              kind: `toggle`,
              label: `Emoji usage`,
              promptOff: `no emojis`,
              promptOn: `use emojis moderately`,
            },
            { id: `html`, kind: `toggle`, label: `HTML formatting`, promptOff: ``, promptOn: `` },
            { accept: `.pdf,.docx`, id: `briefFile`, kind: `file`, label: `Attachments`, pickLabel: `Attach files` },
            { id: `source`, kind: `text`, label: `Source text` },
            { id: `extra`, kind: `text`, label: `Extra constraints`, omitWhenEmpty: true },
            { id: `cta`, kind: `text`, label: `CTA line` },
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
