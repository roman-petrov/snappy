import { AiStreamThemes } from "@snappy/ai-stream";
import { StaticFields } from "@snappy/snappy";

import { FixtureIds } from "./Fixtures";
import { PresetIds } from "./Presets";
import { StreamLabSpeeds } from "./Probe";
import { ProfileIds } from "./Profiles";

const option = (value: string, emoji: string, text: string) => ({ label: { emoji, text }, value });

const fixtureLabel = {
  code: { emoji: `💻`, text: `Code` },
  emphasis: { emoji: `✍️`, text: `Emphasis` },
  headings: { emoji: `📑`, text: `Headings` },
  links: { emoji: `🔗`, text: `Links` },
  lists: { emoji: `📋`, text: `Lists` },
  quotes: { emoji: `💬`, text: `Quotes` },
  showcase: { emoji: `✨`, text: `Showcase` },
  table: { emoji: `📊`, text: `Table` },
} as const;

const presetLabel = {
  "all": { emoji: `📦`, text: `Full suite` },
  "flicker-code": { emoji: `💻`, text: `Flicker code` },
  "flicker-emphasis": { emoji: `✨`, text: `Flicker emphasis` },
  "flicker-list": { emoji: `📋`, text: `Flicker list` },
  "flicker-table": { emoji: `📊`, text: `Flicker table` },
  "modes": { emoji: `🎚️`, text: `Modes` },
  "perf": { emoji: `🚀`, text: `Perf` },
  "table-hang": { emoji: `⏸️`, text: `Table hang` },
} as const;

const profileLabel = {
  "burst": { emoji: `⚡`, text: `Burst` },
  "cut-code": { emoji: `💻`, text: `Cut at code` },
  "cut-emphasis": { emoji: `✂️`, text: `Cut at emphasis` },
  "cut-list": { emoji: `📋`, text: `Cut at list` },
  "cut-table": { emoji: `📊`, text: `Cut at table` },
  "hang-mid": { emoji: `⏸️`, text: `Hang mid-stream` },
  "slow": { emoji: `🐢`, text: `Slow chunks` },
  "token": { emoji: `🔤`, text: `Token` },
  "triple": { emoji: `3️⃣`, text: `Three chunks` },
} as const;

const speedLabel = {
  fast: { emoji: `🐇`, text: `Fast` },
  medium: { emoji: `🚶`, text: `Medium` },
  slow: { emoji: `🐌`, text: `Slow` },
  stream: { emoji: `📡`, text: `Raw stream` },
} as const;

const themeLabel = { chat: { emoji: `💬`, text: `Chat` }, reasoning: { emoji: `🧠`, text: `Reasoning` } } as const;

const options = <Id extends string>(ids: readonly Id[], labels: Record<Id, { emoji: string; text: string }>) =>
  ids.map(id => option(id, labels[id].emoji, labels[id].text));

const fields = StaticFields([
  {
    default: `custom`,
    id: `preset`,
    kind: `single_choice`,
    label: { emoji: `⚡`, text: `Preset (overrides custom)` },
    options: [option(`custom`, `🎛️`, `Custom`), ...options(PresetIds, presetLabel)],
  },
  {
    default: `showcase`,
    id: `fixture`,
    kind: `single_choice`,
    label: { emoji: `📄`, text: `Fixture` },
    options: options(FixtureIds, fixtureLabel),
  },
  {
    default: `token`,
    id: `profile`,
    kind: `single_choice`,
    label: { emoji: `⏱️`, text: `Chunk profile` },
    options: options(ProfileIds, profileLabel),
  },
  {
    default: `medium`,
    id: `speed`,
    kind: `single_choice`,
    label: { emoji: `⌨️`, text: `Typing pace` },
    options: options(StreamLabSpeeds, speedLabel),
  },
  {
    default: `chat`,
    id: `theme`,
    kind: `single_choice`,
    label: { emoji: `🎨`, text: `Theme` },
    options: options(AiStreamThemes, themeLabel),
  },
]);

export const LabPlan = { fields } as const;
