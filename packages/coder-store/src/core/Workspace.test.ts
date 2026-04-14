import { spawnSync } from "node:child_process";
import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import { Workspace } from "./Workspace";

const withWorkspace = async (
  {
    files,
    listFiles,
    prepare,
  }: {
    files?: string[];
    listFiles?: (args: { cwd: string; globs?: string[] }) => Promise<string[]>;
    prepare?: (root: string) => Promise<void>;
  },
  run: (args: {
    list: ReturnType<typeof vi.fn<(args: { cwd: string; globs?: string[] }) => Promise<string[]>>>;
    root: string;
    workspace: ReturnType<typeof Workspace>;
  }) => Promise<void>,
) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), `snappy-workspace-test-`));

  const list = vi.fn(async (args: { cwd: string; globs?: string[] }) => {
    if (listFiles !== undefined) {
      return listFiles(args);
    }
    await Promise.resolve();

    return files ?? [];
  });
  if (prepare !== undefined) {
    await prepare(root);
  }
  const workspace = Workspace({ ignore: { list }, projectRoot: root });
  try {
    await run({ list, root, workspace });
  } finally {
    await fs.rm(root, { force: true, recursive: true });
  }
};

const runGit = ({ args, cwd }: { args: string[]; cwd: string }) =>
  spawnSync(`git`, args, { cwd, encoding: `utf8`, windowsHide: true });

describe(`listDirectory`, () => {
  it(`returns sorted files and directories`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          await fs.mkdir(path.join(root, `a-folder`), { recursive: true });
          await fs.writeFile(path.join(root, `b.txt`), `b`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.listDirectory({ path: `.` })).resolves.toStrictEqual({
          result: `dir a-folder\nfile b.txt`,
        });
      },
    );
  });

  it(`returns path_traversal for unsafe path`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.listDirectory({ path: `../outside` })).resolves.toStrictEqual({ error: `path_traversal` });
    });
  });

  it(`returns list_failed when directory is missing`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.listDirectory({ path: `missing` })).resolves.toStrictEqual({ error: `list_failed` });
    });
  });
});

describe(`readFile`, () => {
  it(`returns path_traversal for unsafe path`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.readFile({ path: `../outside.txt` })).resolves.toStrictEqual({ error: `path_traversal` });
    });
  });

  it(`returns read_binary for binary files`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          await fs.writeFile(path.join(root, `bin.dat`), Buffer.from([1, 0, 2]));
        },
      },
      async ({ workspace }) => {
        await expect(workspace.readFile({ path: `bin.dat` })).resolves.toStrictEqual({ error: `read_binary` });
      },
    );
  });

  it(`truncates content when file exceeds effective read limit`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          const content = `x`.repeat(600);
          await fs.writeFile(path.join(root, `note.txt`), content, `utf8`);
        },
      },
      async ({ workspace }) => {
        const result = await workspace.readFile({ maxChars: 100, path: `note.txt` });
        if (`error` in result) {
          throw new Error(`unexpected error`);
        }

        expect(result.result.endsWith(`\n\n...[truncated]`)).toBe(true);
        expect(result.result.startsWith(`x`.repeat(500))).toBe(true);
      },
    );
  });

  it(`returns read_failed when file is missing`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.readFile({ path: `missing.txt` })).resolves.toStrictEqual({ error: `read_failed` });
    });
  });
});

describe(`writeFile`, () => {
  it(`writes content and creates nested directory`, async () => {
    await withWorkspace({}, async ({ root, workspace }) => {
      await expect(workspace.writeFile({ content: `hello`, path: `nested/file.txt` })).resolves.toStrictEqual({});
      await expect(fs.readFile(path.join(root, `nested/file.txt`), `utf8`)).resolves.toBe(`hello`);
    });
  });

  it(`returns write_too_large when content exceeds limit`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      const tooLarge = `a`.repeat(workspace.limits.maxWriteChars + 1);

      await expect(workspace.writeFile({ content: tooLarge, path: `big.txt` })).resolves.toStrictEqual({
        error: `write_too_large`,
      });
    });
  });

  it(`returns path_traversal for unsafe path`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.writeFile({ content: `x`, path: `../outside.txt` })).resolves.toStrictEqual({
        error: `path_traversal`,
      });
    });
  });
});

describe(`grepReplace`, () => {
  it(`returns old_string_empty when oldString is empty`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          await fs.writeFile(path.join(root, `story.txt`), `abc`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(
          workspace.grepReplace({ glob: `story.txt`, newString: `b`, oldString: `` }),
        ).resolves.toStrictEqual({ error: `old_string_empty` });
      },
    );
  });

  it(`replaces all matches in all files under glob`, async () => {
    await withWorkspace(
      {
        files: [`src/a.txt`, `src/b.txt`],
        prepare: async root => {
          await fs.mkdir(path.join(root, `src`), { recursive: true });
          await fs.writeFile(path.join(root, `src/a.txt`), `a a a`, `utf8`);
          await fs.writeFile(path.join(root, `src/b.txt`), `x a`, `utf8`);
        },
      },
      async ({ root, workspace }) => {
        await expect(workspace.grepReplace({ glob: `src/**`, newString: `b`, oldString: `a` })).resolves.toStrictEqual({
          result: { files: [`src/a.txt`, `src/b.txt`], scopeGlob: `src/**` },
        });
        await expect(fs.readFile(path.join(root, `src/a.txt`), `utf8`)).resolves.toBe(`b b b`);
        await expect(fs.readFile(path.join(root, `src/b.txt`), `utf8`)).resolves.toBe(`x b`);
      },
    );
  });

  it(`returns path_traversal for unsafe glob`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(
        workspace.grepReplace({ glob: `../outside/**`, newString: `b`, oldString: `a` }),
      ).resolves.toStrictEqual({ error: `path_traversal` });
    });
  });

  it(`returns search_scope_failed when glob listing fails`, async () => {
    await withWorkspace({}, async ({ root }) => {
      const workspace = Workspace({
        ignore: {
          list: async () => {
            await Promise.resolve();
            throw new Error(`boom`);
          },
        },
        projectRoot: root,
      });

      await expect(workspace.grepReplace({ glob: `src/**`, newString: `b`, oldString: `a` })).resolves.toStrictEqual({
        error: `search_scope_failed`,
      });
    });
  });

  it(`returns old_string_not_found when text is absent`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.grepReplace({ glob: `**/*`, newString: `b`, oldString: `a` })).resolves.toStrictEqual({
        error: `old_string_not_found`,
      });
    });
  });

  it(`skips binary files and updates text files`, async () => {
    await withWorkspace(
      {
        files: [`bin.dat`, `ok.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `bin.dat`), Buffer.from([1, 0, 2]));
          await fs.writeFile(path.join(root, `ok.txt`), `a`, `utf8`);
        },
      },
      async ({ root, workspace }) => {
        await expect(workspace.grepReplace({ glob: `**/*`, newString: `b`, oldString: `a` })).resolves.toStrictEqual({
          result: { files: [`ok.txt`], scopeGlob: `**/*` },
        });
        await expect(fs.readFile(path.join(root, `ok.txt`), `utf8`)).resolves.toBe(`b`);
      },
    );
  });

  it(`returns old_string_not_found when files are outside scope`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          await fs.mkdir(path.join(root, `src`), { recursive: true });
          await fs.writeFile(path.join(root, `story.txt`), `a`, `utf8`);
          await fs.writeFile(path.join(root, `src/in-scope.txt`), `x`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grepReplace({ glob: `src/**`, newString: `b`, oldString: `a` })).resolves.toStrictEqual({
          error: `old_string_not_found`,
        });
      },
    );
  });

  it(`works with concrete file path as glob`, async () => {
    await withWorkspace(
      {
        files: [`src/story.txt`],
        prepare: async root => {
          await fs.mkdir(path.join(root, `src`), { recursive: true });
          await fs.writeFile(path.join(root, `src/story.txt`), `a`, `utf8`);
        },
      },
      async ({ root, workspace }) => {
        await expect(
          workspace.grepReplace({ glob: `src/story.txt`, newString: `b`, oldString: `a` }),
        ).resolves.toStrictEqual({ result: { files: [`src/story.txt`], scopeGlob: `src/story.txt` } });
        await expect(fs.readFile(path.join(root, `src/story.txt`), `utf8`)).resolves.toBe(`b`);
      },
    );
  });
});

describe(`grep`, () => {
  it(`matches case-insensitive patterns when caseInsensitive is true`, async () => {
    await withWorkspace(
      {
        files: [`a.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `a.txt`), `FoO`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grep({ caseInsensitive: true, pattern: `foo` })).resolves.toStrictEqual({
          result: { files: [`a.txt`], scopeGlob: `**/*` },
        });
      },
    );
  });

  it(`supports anchors in regex patterns`, async () => {
    await withWorkspace(
      {
        files: [`a.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `a.txt`), `start\nmiddle\nend`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grep({ pattern: `^start$` })).resolves.toStrictEqual({
          result: { files: [`a.txt`], scopeGlob: `**/*` },
        });
      },
    );
  });

  it(`supports character classes and quantifiers`, async () => {
    await withWorkspace(
      {
        files: [`a.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `a.txt`), `id-12\nid-abc\nid-9`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grep({ pattern: `^id-[0-9]{1,2}$` })).resolves.toStrictEqual({
          result: { files: [`a.txt`], scopeGlob: `**/*` },
        });
      },
    );
  });

  it(`supports escaped literals in regex`, async () => {
    await withWorkspace(
      {
        files: [`a.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `a.txt`), `a.b\nabc\na-b`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grep({ pattern: String.raw`^a\.b$` })).resolves.toStrictEqual({
          result: { files: [`a.txt`], scopeGlob: `**/*` },
        });
      },
    );
  });

  it(`applies regex case-insensitive flag correctly`, async () => {
    await withWorkspace(
      {
        files: [`a.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `a.txt`), `FOO\nfoo\nFoO`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grep({ caseInsensitive: true, pattern: `^foo$` })).resolves.toStrictEqual({
          result: { files: [`a.txt`], scopeGlob: `**/*` },
        });
      },
    );
  });

  it(`counts regex matches across listed files and respects maxHits`, async () => {
    await withWorkspace(
      {
        files: [`a.txt`, `b.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `a.txt`), `foo\nbar\nfoo`, `utf8`);
          await fs.writeFile(path.join(root, `b.txt`), `foo`, `utf8`);
        },
      },
      async ({ list, workspace }) => {
        await expect(workspace.grep({ maxHits: 2, pattern: `fo+` })).resolves.toStrictEqual({
          result: { files: [`a.txt`, `b.txt`], scopeGlob: `**/*` },
        });

        const args = list.mock.calls[0]?.[0];

        expect(args?.globs).toStrictEqual([`**/*`]);
        expect(args?.cwd).toBeTypeOf(`string`);
      },
    );
  });

  it(`normalizes maxHits below one to one file`, async () => {
    await withWorkspace(
      {
        files: [`a.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `a.txt`), `foo\nfoo`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grep({ maxHits: 0, pattern: `foo` })).resolves.toStrictEqual({
          result: { files: [`a.txt`], scopeGlob: `**/*` },
        });
      },
    );
  });

  it(`returns grep_invalid_pattern for invalid regex`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.grep({ pattern: `(` })).resolves.toStrictEqual({ error: `grep_invalid_pattern` });
    });
  });

  it(`returns path_traversal for unsafe glob`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.grep({ glob: `../x`, pattern: `x` })).resolves.toStrictEqual({ error: `path_traversal` });
    });
  });

  it(`returns grep_list_failed when ignore list fails`, async () => {
    await withWorkspace({}, async ({ root }) => {
      const workspace = Workspace({
        ignore: {
          list: async () => {
            await Promise.resolve();
            throw new Error(`boom`);
          },
        },
        projectRoot: root,
      });

      await expect(workspace.grep({ pattern: `x` })).resolves.toStrictEqual({ error: `grep_list_failed` });
    });
  });

  it(`scans only files under glob`, async () => {
    await withWorkspace(
      {
        files: [`src/a.txt`],
        prepare: async root => {
          await fs.mkdir(path.join(root, `src`), { recursive: true });
          await fs.writeFile(path.join(root, `src/a.txt`), `needle`, `utf8`);
        },
      },
      async ({ list, workspace }) => {
        await expect(workspace.grep({ glob: `src/**`, pattern: `needle` })).resolves.toStrictEqual({
          result: { files: [`src/a.txt`], scopeGlob: `src/**` },
        });
        expect(list.mock.calls[0]?.[0]?.globs).toStrictEqual([`src/**`]);
      },
    );
  });

  it(`skips unreadable files and still counts readable matches`, async () => {
    await withWorkspace(
      {
        files: [`ok.txt`, `missing.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `ok.txt`), `needle`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grep({ pattern: `needle` })).resolves.toStrictEqual({
          result: { files: [`ok.txt`], scopeGlob: `**/*` },
        });
      },
    );
  });

  it(`skips binary and oversized files`, async () => {
    await withWorkspace(
      {
        files: [`bin.dat`, `big.txt`, `ok.txt`],
        prepare: async root => {
          await fs.writeFile(path.join(root, `bin.dat`), Buffer.from([1, 0, 2]));
          await fs.writeFile(path.join(root, `big.txt`), `x`.repeat(900_001), `utf8`);
          await fs.writeFile(path.join(root, `ok.txt`), `needle`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.grep({ pattern: `needle` })).resolves.toStrictEqual({
          result: { files: [`ok.txt`], scopeGlob: `**/*` },
        });
      },
    );
  });
});

describe(`glob`, () => {
  it(`returns matched directories and files sorted`, async () => {
    await withWorkspace(
      {
        listFiles: async ({ globs }) => {
          await Promise.resolve();

          return globs?.[0] === `src/*` ? [`src/a.ts`] : [];
        },
        prepare: async root => {
          await fs.mkdir(path.join(root, `src/dir`), { recursive: true });
          await fs.writeFile(path.join(root, `src/a.ts`), `a`, `utf8`);
          await fs.writeFile(path.join(root, `src/dir/b.ts`), `b`, `utf8`);
        },
      },
      async ({ workspace }) => {
        await expect(workspace.glob({ pattern: `src/*` })).resolves.toStrictEqual({
          result: `dir src/dir\nfile src/a.ts`,
        });
      },
    );
  });

  it(`returns path_traversal for unsafe pattern`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.glob({ pattern: `../outside/*` })).resolves.toStrictEqual({ error: `path_traversal` });
    });
  });

  it(`returns glob_pattern_empty for empty pattern`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.glob({ pattern: `   ` })).resolves.toStrictEqual({ error: `glob_pattern_empty` });
    });
  });

  it(`returns glob_list_failed when ignore list fails`, async () => {
    await withWorkspace({}, async ({ root }) => {
      const workspace = Workspace({
        ignore: {
          list: async () => {
            await Promise.resolve();
            throw new Error(`boom`);
          },
        },
        projectRoot: root,
      });

      await expect(workspace.glob({ pattern: `src/*` })).resolves.toStrictEqual({ error: `glob_list_failed` });
    });
  });
});

describe(`renameFile`, () => {
  it(`returns path_traversal for unsafe source path`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.renameFile({ newName: `new.txt`, path: `../old.txt` })).resolves.toStrictEqual({
        error: `path_traversal`,
      });
    });
  });

  it(`returns invalid_name for unsafe target name`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.renameFile({ newName: `../bad.txt`, path: `a.txt` })).resolves.toStrictEqual({
        error: `invalid_name`,
      });
    });
  });

  it(`renames tracked file via git mv`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          runGit({ args: [`init`], cwd: root });
          await fs.writeFile(path.join(root, `old.txt`), `a`, `utf8`);
          runGit({ args: [`add`, `old.txt`], cwd: root });
        },
      },
      async ({ root, workspace }) => {
        await expect(workspace.renameFile({ newName: `new.txt`, path: `old.txt` })).resolves.toStrictEqual({
          error: undefined,
        });
        await expect(fs.readFile(path.join(root, `new.txt`), `utf8`)).resolves.toBe(`a`);
      },
    );
  });

  it(`renames untracked file without git mv`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          runGit({ args: [`init`], cwd: root });
          await fs.writeFile(path.join(root, `old.txt`), `a`, `utf8`);
        },
      },
      async ({ root, workspace }) => {
        await expect(workspace.renameFile({ newName: `new.txt`, path: `old.txt` })).resolves.toStrictEqual({
          error: undefined,
        });
        await expect(fs.readFile(path.join(root, `new.txt`), `utf8`)).resolves.toBe(`a`);
      },
    );
  });
});

describe(`moveFile`, () => {
  it(`returns path_traversal for unsafe source path`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.moveFile({ directoryPath: `dir`, path: `../a.txt` })).resolves.toStrictEqual({
        error: `path_traversal`,
      });
    });
  });

  it(`moves tracked file into target directory via git mv`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          runGit({ args: [`init`], cwd: root });
          await fs.writeFile(path.join(root, `a.txt`), `a`, `utf8`);
          runGit({ args: [`add`, `a.txt`], cwd: root });
        },
      },
      async ({ root, workspace }) => {
        await expect(workspace.moveFile({ directoryPath: `dir`, path: `a.txt` })).resolves.toStrictEqual({});
        await expect(fs.readFile(path.join(root, `dir/a.txt`), `utf8`)).resolves.toBe(`a`);
      },
    );
  });

  it(`moves untracked file into target directory without git mv`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          runGit({ args: [`init`], cwd: root });
          await fs.writeFile(path.join(root, `a.txt`), `a`, `utf8`);
        },
      },
      async ({ root, workspace }) => {
        await expect(workspace.moveFile({ directoryPath: `dir`, path: `a.txt` })).resolves.toStrictEqual({});
        await expect(fs.readFile(path.join(root, `dir/a.txt`), `utf8`)).resolves.toBe(`a`);
      },
    );
  });

  it(`returns path_traversal for unsafe target directory`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.moveFile({ directoryPath: `../out`, path: `a.txt` })).resolves.toStrictEqual({
        error: `path_traversal`,
      });
    });
  });
});

describe(`deleteFile`, () => {
  it(`returns path_traversal for unsafe path`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.deleteFile({ path: `../outside.txt` })).resolves.toStrictEqual({
        error: `path_traversal`,
      });
    });
  });

  it(`deletes existing file`, async () => {
    await withWorkspace(
      {
        prepare: async root => {
          await fs.writeFile(path.join(root, `gone.txt`), `x`, `utf8`);
        },
      },
      async ({ root, workspace }) => {
        await expect(workspace.deleteFile({ path: `gone.txt` })).resolves.toStrictEqual({});
        await expect(fs.access(path.join(root, `gone.txt`))).rejects.toBeDefined();
      },
    );
  });

  it(`returns delete_failed when file is missing`, async () => {
    await withWorkspace({}, async ({ workspace }) => {
      await expect(workspace.deleteFile({ path: `missing.txt` })).resolves.toStrictEqual({ error: `delete_failed` });
    });
  });
});
