export type ChunkMode = `char` | `greedy` | `line` | `word`;

export type Profile = {
  chunk: ChunkMode;
  cutMarkers?: string[];
  delayMs: number;
  hangAtRatio?: number;
  hangMs?: number;
};

export const ProfileIds = [
  `burst`,
  `token`,
  `slow`,
  `hang-mid`,
  `cut-emphasis`,
  `cut-code`,
  `cut-table`,
  `cut-list`,
] as const;

export type ProfileId = (typeof ProfileIds)[number];

export const Profiles = {
  "burst": { chunk: `greedy`, delayMs: 0 },
  "cut-code": { chunk: `char`, cutMarkers: [`\`\`\``], delayMs: 12 },
  "cut-emphasis": { chunk: `char`, cutMarkers: [`**`, `_`], delayMs: 12 },
  "cut-list": { chunk: `char`, cutMarkers: [`\n- `, `\n1. `], delayMs: 12 },
  "cut-table": { chunk: `char`, cutMarkers: [`|`], delayMs: 12 },
  "hang-mid": { chunk: `word`, delayMs: 20, hangAtRatio: 0.45, hangMs: 1200 },
  "slow": { chunk: `char`, delayMs: 45 },
  "token": { chunk: `char`, delayMs: 16 },
} as const satisfies Record<ProfileId, Profile>;
