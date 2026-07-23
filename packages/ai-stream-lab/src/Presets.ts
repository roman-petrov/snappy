import type { AiStreamTheme } from "@snappy/ai-stream";

import type { FixtureId } from "./Fixtures";
import type { StreamLabSpeed } from "./Probe";
import type { ProfileId } from "./Profiles";

export type Preset = { fixture: FixtureId; profile: ProfileId; speed: StreamLabSpeed; theme: AiStreamTheme };

export type PresetId =
  `all` | `flicker-code` | `flicker-emphasis` | `flicker-list` | `flicker-table` | `modes` | `perf` | `table-hang`;

export const PresetIds = [
  `flicker-emphasis`,
  `flicker-code`,
  `flicker-table`,
  `flicker-list`,
  `table-hang`,
  `perf`,
  `modes`,
  `all`,
] as const;

export const Presets = {
  "flicker-code": { fixture: `code-fence`, profile: `cut-code`, speed: `fast`, theme: `chat` },
  "flicker-emphasis": { fixture: `emphasis-stress`, profile: `cut-emphasis`, speed: `fast`, theme: `chat` },
  "flicker-list": { fixture: `list-table-code`, profile: `cut-list`, speed: `fast`, theme: `chat` },
  "flicker-table": { fixture: `list-table-code`, profile: `cut-table`, speed: `fast`, theme: `chat` },
  "modes": { fixture: `showcase`, profile: `token`, speed: `stream`, theme: `chat` },
  "perf": { fixture: `list-table-code`, profile: `burst`, speed: `stream`, theme: `chat` },
  "table-hang": { fixture: `list-table-code`, profile: `hang-mid`, speed: `slow`, theme: `chat` },
} as const satisfies Record<Exclude<PresetId, `all`>, Preset>;

export const SuitePresets = [
  Presets[`flicker-emphasis`],
  Presets[`flicker-code`],
  Presets[`flicker-table`],
  Presets[`flicker-list`],
  Presets[`table-hang`],
  Presets.perf,
  Presets.modes,
  { ...Presets.modes, speed: `fast` as const },
  { ...Presets.modes, theme: `reasoning` as const },
] as const;
