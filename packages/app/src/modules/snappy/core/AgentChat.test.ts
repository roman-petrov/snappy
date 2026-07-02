import { describe, expect, it } from "vitest";

import { AgentChat } from "./AgentChat";

const { messages, prefixed, transcriptSection } = AgentChat;

describe(`messages`, () => {
  it(`prepends Russian system policy for ru locale`, () => {
    expect(messages(`ru`, `Brief`)[0]?.content).toContain(`русском`);
  });

  it(`prepends English system policy for en locale`, () => {
    expect(messages(`en`, `Brief`)[0]?.content).toContain(`English`);
  });
});

describe(`prefixed`, () => {
  it(`embeds language policy before content`, () => {
    expect(prefixed(`en`, `Brief`)).toContain(`Brief`);
    expect(prefixed(`en`, `Brief`).startsWith(`<language_policy>`)).toBe(true);
  });
});

describe(`transcriptSection`, () => {
  it(`labels transcript in user locale`, () => {
    expect(transcriptSection(`ru`, `текст`)).toBe(`Расшифровка:\nтекст`);
    expect(transcriptSection(`en`, `text`)).toBe(`Transcript:\ntext`);
  });
});
