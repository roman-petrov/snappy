import { describe, expect, it } from "vitest";

import { TsChunk } from "./TsChunk";

const { build, extensions } = TsChunk;

describe(`TsChunk`, () => {
  it(`declares extension list`, () => {
    expect(extensions).toStrictEqual([`.ts`]);
  });

  describe(`build`, () => {
    it(`returns empty list for empty source`, () => {
      expect(build({ path: `empty.ts`, source: `` })).toMatchInlineSnapshot(`[]`);
    });

    it(`extracts top-level declarations`, () => {
      expect(
        build({
          path: `types.ts`,
          source: `interface A { a: number }\ntype Id = string;\nfunction run(): number { return 1; }\nclass User { id: Id = "x"; }\nenum Kind { A = "a" }`,
        }),
      ).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "types.ts",
            "startLine": 1,
            "text": "interface A { a: number }",
          },
          {
            "endLine": 2,
            "path": "types.ts",
            "startLine": 2,
            "text": "type Id = string;",
          },
          {
            "endLine": 3,
            "path": "types.ts",
            "startLine": 3,
            "text": "function run(): number { return 1; }",
          },
          {
            "endLine": 4,
            "path": "types.ts",
            "startLine": 4,
            "text": "class User { id: Id = "x"; }",
          },
          {
            "endLine": 5,
            "path": "types.ts",
            "startLine": 5,
            "text": "enum Kind { A = "a" }",
          },
        ]
      `);
    });

    it(`extracts top-level imports and exports`, () => {
      expect(
        build({
          path: `api.ts`,
          source: `import type { User } from "./types";\nexport const run = (user: User) => user.id;\nexport * from "./other";`,
        }),
      ).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "api.ts",
            "startLine": 1,
            "text": "import type { User } from "./types";",
          },
          {
            "endLine": 2,
            "path": "api.ts",
            "startLine": 2,
            "text": "export const run = (user: User) => user.id;",
          },
          {
            "endLine": 3,
            "path": "api.ts",
            "startLine": 3,
            "text": "export * from "./other";",
          },
        ]
      `);
    });

    it(`extracts barrel index exports as separate chunks`, () => {
      expect(
        build({
          path: `index.ts`,
          source: `export * from "./Timer";\nexport * from "./Math";\nexport * from "./internal";`,
        }),
      ).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "index.ts",
            "startLine": 1,
            "text": "export * from "./Timer";",
          },
          {
            "endLine": 2,
            "path": "index.ts",
            "startLine": 2,
            "text": "export * from "./Math";",
          },
          {
            "endLine": 3,
            "path": "index.ts",
            "startLine": 3,
            "text": "export * from "./internal";",
          },
        ]
      `);
    });

    it(`extracts non-exported const arrow as arrow expression chunk`, () => {
      expect(build({ path: `local.ts`, source: `const run = (value: number) => value + 1;` })).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "local.ts",
            "startLine": 1,
            "text": "(value: number) => value + 1",
          },
        ]
      `);
    });

    it(`extracts exported const arrow as export statement chunk`, () => {
      expect(build({ path: `api-local.ts`, source: `export const run = (value: number) => value + 1;` }))
        .toMatchInlineSnapshot(`
          [
            {
              "endLine": 1,
              "path": "api-local.ts",
              "startLine": 1,
              "text": "export const run = (value: number) => value + 1;",
            },
          ]
        `);
    });

    it(`does not extract const function expression`, () => {
      expect(build({ path: `fn.ts`, source: `const run = function (value: number) { return value + 1; };` }))
        .toMatchInlineSnapshot(`[]`);
    });

    it(`keeps class as one chunk and skips nested methods`, () => {
      expect(
        build({
          path: `class.ts`,
          source: `class Service {\n  run() { return 1; }\n  stop() { return 2; }\n}`,
        }),
      ).toMatchInlineSnapshot(`
        [
          {
            "endLine": 4,
            "path": "class.ts",
            "startLine": 1,
            "text": "class Service {
          run() { return 1; }
          stop() { return 2; }
        }",
          },
        ]
      `);
    });

    it(`extracts enums namespaces and module declarations`, () => {
      expect(
        build({
          path: `shapes.ts`,
          source: `enum Kind { A = "a" }\nnamespace Api { export type Id = string; }\ndeclare module "x" { export const ok: true; }`,
        }),
      ).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "shapes.ts",
            "startLine": 1,
            "text": "enum Kind { A = "a" }",
          },
          {
            "endLine": 2,
            "path": "shapes.ts",
            "startLine": 2,
            "text": "export type Id = string;",
          },
          {
            "endLine": 3,
            "path": "shapes.ts",
            "startLine": 3,
            "text": "module "x" { export const ok: true; }",
          },
        ]
      `);
    });

    it(`extracts pure module pattern`, () => {
      expect(
        build({
          path: `Math.ts`,
          source: `const add = (a: number, b: number) => a + b;\nconst subtract = (a: number, b: number) => a - b;\n\nexport const Math = { add, subtract };`,
        }),
      ).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "Math.ts",
            "startLine": 1,
            "text": "(a: number, b: number) => a + b",
          },
          {
            "endLine": 2,
            "path": "Math.ts",
            "startLine": 2,
            "text": "(a: number, b: number) => a - b",
          },
          {
            "endLine": 4,
            "path": "Math.ts",
            "startLine": 4,
            "text": "export const Math = { add, subtract };",
          },
        ]
      `);
    });

    it(`extracts factory module pattern`, () => {
      expect(
        build({
          path: `Timer.ts`,
          source: `export type TimerConfig = { delay: number };\n\nexport const Timer = ({ delay }: TimerConfig) => {\n  let id: ReturnType<typeof setInterval> | undefined = undefined;\n\n  const start = () => {\n    id = setInterval(() => {}, delay);\n  };\n\n  const stop = () => {\n    if (id !== undefined) {\n      clearInterval(id);\n      id = undefined;\n    }\n  };\n\n  return { start, stop };\n};\n\nexport type Timer = ReturnType<typeof Timer>;`,
        }),
      ).toMatchInlineSnapshot(`
        [
          {
            "endLine": 1,
            "path": "Timer.ts",
            "startLine": 1,
            "text": "export type TimerConfig = { delay: number };",
          },
          {
            "endLine": 18,
            "path": "Timer.ts",
            "startLine": 3,
            "text": "export const Timer = ({ delay }: TimerConfig) => {
          let id: ReturnType<typeof setInterval> | undefined = undefined;

          const start = () => {
            id = setInterval(() => {}, delay);
          };

          const stop = () => {
            if (id !== undefined) {
              clearInterval(id);
              id = undefined;
            }
          };

          return { start, stop };
        };",
          },
          {
            "endLine": 20,
            "path": "Timer.ts",
            "startLine": 20,
            "text": "export type Timer = ReturnType<typeof Timer>;",
          },
        ]
      `);
    });
  });
});
