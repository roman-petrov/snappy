/* jscpd:ignore-start */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* cspell:ignore unmatch */
import { _ } from "@snappy/core";
import { spawn } from "node:child_process";
import * as fs from "node:fs/promises";
import path from "node:path";

import type { CoderIgnore } from "./CoderIgnore";

export type WorkspaceConfig = { ignore: CoderIgnore; projectRoot: string };

export const Workspace = ({ ignore, projectRoot }: WorkspaceConfig) => {
  const limits = {
    defaultReadChars: 48_000,
    globPatternMaxChars: 4000,
    grepMaxHitsDefault: 80,
    grepMaxHitsLimit: 500,
    grepPatternMaxChars: 4000,
    grepPreviewChars: 500,
    maxFileBytes: 900_000,
    maxReadChars: 120_000,
    maxWriteChars: 1_500_000,
    minReadChars: 500,
  } as const;

  const globChars = /[*?[{]/u;
  const rootResolved = path.resolve(projectRoot);

  const assertSafeRelativeScanPath = (relativePosix: string) => {
    const trimmed = relativePosix.trim().replaceAll(`\\`, `/`).replace(/^\/+/u, ``);

    return path.isAbsolute(trimmed) || trimmed.split(`/`).filter(Boolean).includes(`..`)
      ? ({ error: `path_traversal` } as const)
      : undefined;
  };

  const resolveUnderRoot = (relativePosix: string) => {
    const trimmed = relativePosix.trim().replaceAll(`\\`, `/`);
    const segments = trimmed.split(`/`).filter(Boolean);
    if (segments.includes(`..`)) {
      return { error: `path_traversal` } as const;
    }
    const absolute = path.resolve(projectRoot, ...segments);
    const relativeToRoot = path.relative(rootResolved, absolute);
    if (relativeToRoot.startsWith(`..`) || path.isAbsolute(relativeToRoot)) {
      return { error: `path_traversal` } as const;
    }

    return absolute;
  };

  const findInText = ({
    caseInsensitive,
    lines,
    pattern,
  }: {
    caseInsensitive: boolean;
    lines: string[];
    pattern: string;
  }) => {
    const flags = caseInsensitive ? `iu` : `u`;
    const regex = new RegExp(pattern, flags);
    const out: { line: number; text: string }[] = [];
    for (const [lineIndex, lineText] of lines.entries()) {
      if (regex.test(lineText)) {
        out.push({
          line: lineIndex + 1,
          text: lineText.length > limits.grepPreviewChars ? `${lineText.slice(0, limits.grepPreviewChars)}…` : lineText,
        });
      }
    }

    return out;
  };

  const toGlobRegex = (pattern: string) => {
    let regex = ``;
    let index = 0;
    while (index < pattern.length) {
      const char = pattern[index];
      const next = pattern[index + 1];
      if (char === undefined) {
        break;
      }
      if (char === `*` && next === `*`) {
        regex += `.*`;
        index += 2;
        continue;
      }
      if (char === `*`) {
        regex += `[^/]*`;
        index += 1;
        continue;
      }
      if (char === `?`) {
        regex += `[^/]`;
        index += 1;
        continue;
      }
      regex +=
        char === `\\` ||
        char === `^` ||
        char === `$` ||
        char === `+` ||
        char === `.` ||
        char === `(` ||
        char === `)` ||
        char === `|` ||
        char === `[` ||
        char === `]` ||
        char === `{` ||
        char === `}`
          ? `\\${char}`
          : char;
      index += 1;
    }

    return new RegExp(`^${regex}$`, `u`);
  };

  const toGitPath = (absolutePath: string) => path.relative(rootResolved, absolutePath).split(path.sep).join(`/`);

  const runGit = async (args: string[]): Promise<undefined | { error: `git_move_failed` }> =>
    new Promise(resolve => {
      const child = spawn(`git`, args, { cwd: rootResolved, windowsHide: true });
      child.on(`error`, () => resolve({ error: `git_move_failed` } as const));
      child.on(`close`, code => resolve(code === 0 ? undefined : ({ error: `git_move_failed` } as const)));
    });

  const runGitCode = async (args: string[]) =>
    new Promise<number>(resolve => {
      const child = spawn(`git`, args, { cwd: rootResolved, windowsHide: true });
      child.on(`error`, () => resolve(1));
      child.on(`close`, code => resolve(code ?? 1));
    });

  const isTrackedByGit = async (absolutePath: string) =>
    (await runGitCode([`ls-files`, `--error-unmatch`, `--`, toGitPath(absolutePath)])) === 0;

  const movePath = async ({
    from,
    onRenameError,
    to,
  }: {
    from: string;
    onRenameError: `move_failed` | `rename_failed`;
    to: string;
  }) => {
    if (await isTrackedByGit(from)) {
      return runGit([`mv`, `-f`, `--`, toGitPath(from), toGitPath(to)]);
    }
    const renameError = await fs.rename(from, to).catch(() => onRenameError);

    return renameError === undefined ? undefined : ({ error: renameError } as const);
  };

  const ensureDirectory = async ({
    error,
    target,
  }: {
    error: `move_mkdir_failed` | `write_mkdir_failed`;
    target: string;
  }) =>
    fs
      .mkdir(target, { recursive: true })
      .then(() => undefined)
      .catch(() => error);

  const assertValidName = (name: string) => {
    const trimmed = name.trim();
    if (trimmed === `` || trimmed === `.` || trimmed === `..` || trimmed.includes(`/`) || trimmed.includes(`\\`)) {
      return { error: `invalid_name` } as const;
    }

    return undefined;
  };

  type FilesByGlob =
    | { error: `glob_list_failed` | `glob_pattern_empty` | `path_traversal` }
    | { files: string[]; normalized: string };

  const filesByGlob = async (pattern: string): Promise<FilesByGlob> => {
    const normalized = pattern
      .trim()
      .replaceAll(`\\`, `/`)
      .replace(/^\.\/+/u, ``);
    if (normalized.length === 0) {
      return { error: `glob_pattern_empty` } as const;
    }
    const pathError = globChars.test(normalized)
      ? assertSafeRelativeScanPath(normalized)
      : resolveUnderRoot(normalized);
    if (pathError !== undefined && !_.isString(pathError)) {
      return pathError;
    }
    const files = await ignore.list({ cwd: projectRoot, globs: [normalized] }).catch(() => undefined);
    if (files === undefined) {
      return { error: `glob_list_failed` } as const;
    }

    return { files, normalized };
  };

  const eachSearchableFile = async ({
    files,
    visit,
  }: {
    files: string[];
    visit: (args: { absolute: string; relativePathPosix: string; text: string }) => boolean | Promise<boolean>;
  }) => {
    for (const relativePathPosix of files) {
      const absolute = path.join(projectRoot, relativePathPosix.split(`/`).join(path.sep));
      const raw = await fs.readFile(absolute).catch(() => undefined);
      if (raw === undefined || raw.includes(0) || raw.byteLength > limits.maxFileBytes) {
        continue;
      }
      const shouldStop = await visit({ absolute, relativePathPosix, text: raw.toString(`utf8`) });
      if (shouldStop) {
        break;
      }
    }
  };

  const grep = async ({
    caseInsensitive,
    glob: globPattern,
    maxHits,
    pattern,
  }: {
    caseInsensitive?: boolean;
    glob?: string;
    maxHits?: number;
    pattern: string;
  }) => {
    const maxFiles = Math.min(Math.max(Math.trunc(maxHits ?? limits.grepMaxHitsDefault), 1), limits.grepMaxHitsLimit);
    const searchCaseInsensitive = caseInsensitive === true;

    const validPattern = (() => {
      try {
        return new RegExp(pattern, searchCaseInsensitive ? `iu` : `u`);
      } catch {
        return undefined;
      }
    })();
    if (validPattern === undefined) {
      return { error: `grep_invalid_pattern` } as const;
    }

    const scopeGlob = (globPattern ?? `**/*`).trim().replaceAll(`\\`, `/`);
    if (scopeGlob.length === 0) {
      return { error: `grep_invalid_glob` } as const;
    }
    const scopePathError = globChars.test(scopeGlob)
      ? assertSafeRelativeScanPath(scopeGlob)
      : resolveUnderRoot(scopeGlob);
    if (scopePathError !== undefined && !_.isString(scopePathError)) {
      return scopePathError;
    }
    const scopeResult = await filesByGlob(scopeGlob);
    if (`error` in scopeResult) {
      return scopeResult.error === `path_traversal`
        ? scopeResult
        : scopeResult.error === `glob_pattern_empty`
          ? ({ error: `grep_invalid_glob` } as const)
          : ({ error: `grep_list_failed` } as const);
    }
    const { files } = scopeResult;
    const matchedFiles = new Set<string>();

    await eachSearchableFile({
      files,
      visit: ({ relativePathPosix, text }) => {
        const hits = findInText({ caseInsensitive: searchCaseInsensitive, lines: text.split(/\r?\n/u), pattern });
        if (hits.some(hit => hit.line > 0)) {
          matchedFiles.add(relativePathPosix);
        }

        return matchedFiles.size >= maxFiles;
      },
    });

    return {
      result: { files: [...matchedFiles].toSorted((left, right) => left.localeCompare(right)), scopeGlob },
    } as const;
  };

  const glob = async ({ pattern }: { pattern: string }) => {
    const scopeResult = await filesByGlob(pattern);
    if (`error` in scopeResult) {
      return scopeResult;
    }
    const { files, normalized } = scopeResult;
    const segments = normalized.split(`/`).filter(Boolean);
    const wildcardIndex = segments.findIndex(segment => globChars.test(segment));
    const literalRoot = segments.slice(0, wildcardIndex === -1 ? segments.length : wildcardIndex).join(`/`);
    const searchRootAbsolute = resolveUnderRoot(literalRoot === `` ? `.` : literalRoot);
    if (!_.isString(searchRootAbsolute)) {
      return searchRootAbsolute;
    }

    const directorySet = new Set<string>();
    const matcher = toGlobRegex(normalized);
    const pending = [searchRootAbsolute];
    while (pending.length > 0) {
      const current = pending.pop();
      if (current === undefined) {
        continue;
      }
      const entries = await fs.readdir(current, { withFileTypes: true }).catch(() => undefined);
      if (entries === undefined) {
        continue;
      }
      for (const entry of entries) {
        if (!entry.isDirectory()) {
          continue;
        }
        const absolute = path.join(current, entry.name);
        const relative = path.relative(rootResolved, absolute).split(path.sep).join(`/`);
        if (relative !== `` && matcher.test(relative)) {
          directorySet.add(relative);
        }
        pending.push(absolute);
      }
    }

    const fileLines = files.toSorted((left, right) => left.localeCompare(right)).map(value => `file ${value}`);

    const directoryLines = [...directorySet]
      .toSorted((left, right) => left.localeCompare(right))
      .map(value => `dir ${value}`);

    const lines = [...directoryLines, ...fileLines];

    return { result: lines.join(`\n`) } as const;
  };

  const listDirectory = async ({ path: relativePath }: { path?: string }) => {
    const absolute = resolveUnderRoot(relativePath ?? `.`);
    if (!_.isString(absolute)) {
      return absolute;
    }
    const names = await fs.readdir(absolute, { withFileTypes: true }).catch(() => undefined);
    if (names === undefined) {
      return { error: `list_failed` } as const;
    }

    const sorted = names.toSorted((left, right) => left.name.localeCompare(right.name));
    const result = sorted.map(entry => `${entry.isDirectory() ? `dir` : `file`} ${entry.name}`).join(`\n`);

    return { result } as const;
  };

  const readFile = async ({ maxChars, path: relativePath }: { maxChars?: number; path: string }) => {
    const absolute = resolveUnderRoot(relativePath);
    if (!_.isString(absolute)) {
      return absolute;
    }
    const raw = await fs.readFile(absolute).catch(() => undefined);
    if (raw === undefined) {
      return { error: `read_failed` } as const;
    }
    if (raw.includes(0)) {
      return { error: `read_binary` } as const;
    }
    const text = raw.toString(`utf8`);
    const readLimit = Math.min(Math.max(maxChars ?? limits.defaultReadChars, limits.minReadChars), limits.maxReadChars);
    const result = text.length > readLimit ? `${text.slice(0, readLimit)}\n\n...[truncated]` : text;

    return { result } as const;
  };

  const grepReplace = async ({
    glob: globPattern,
    newString,
    oldString,
  }: {
    glob: string;
    newString: string;
    oldString: string;
  }) => {
    if (oldString.length === 0) {
      return { error: `old_string_empty` } as const;
    }
    const scopeGlob = globPattern.trim().replaceAll(`\\`, `/`);
    const scopeResult = await filesByGlob(scopeGlob);
    if (`error` in scopeResult) {
      return scopeResult.error === `path_traversal` ? scopeResult : ({ error: `search_scope_failed` } as const);
    }
    const changedFiles: string[] = [];
    const state = { hasWriteError: false };

    await eachSearchableFile({
      files: scopeResult.files,
      visit: async ({ absolute, relativePathPosix, text }) => {
        if (!text.includes(oldString)) {
          return false;
        }

        const next = text.split(oldString).join(newString);

        const failed = await fs
          .writeFile(absolute, next, `utf8`)
          .then(() => false)
          .catch(() => true);
        if (failed) {
          state.hasWriteError = true;

          return true;
        }

        changedFiles.push(relativePathPosix);

        return false;
      },
    });

    if (state.hasWriteError) {
      return { error: `search_write_failed` } as const;
    }

    if (changedFiles.length === 0) {
      return { error: `old_string_not_found` } as const;
    }

    return { result: { files: changedFiles.toSorted((left, right) => left.localeCompare(right)), scopeGlob } } as const;
  };

  const writeFile = async ({ content, path: relativePath }: { content: string; path: string }) => {
    if (content.length > limits.maxWriteChars) {
      return { error: `write_too_large` } as const;
    }
    const absolute = resolveUnderRoot(relativePath);
    if (!_.isString(absolute)) {
      return absolute;
    }
    const mkdirError = await ensureDirectory({ error: `write_mkdir_failed`, target: path.dirname(absolute) });
    if (mkdirError !== undefined) {
      return { error: mkdirError } as const;
    }
    const writeError = await fs.writeFile(absolute, content, `utf8`).catch(() => `write_failed` as const);
    if (writeError !== undefined) {
      return { error: writeError } as const;
    }

    return {};
  };

  const renameFile = async ({ newName, path: relativePath }: { newName: string; path: string }) => {
    const done = { error: undefined } as const;
    const nameError = assertValidName(newName);
    if (nameError !== undefined) {
      return nameError;
    }
    const sourceAbsolute = resolveUnderRoot(relativePath);
    if (!_.isString(sourceAbsolute)) {
      return sourceAbsolute;
    }
    const targetAbsolute = path.join(path.dirname(sourceAbsolute), newName.trim());
    const moveError = await movePath({ from: sourceAbsolute, onRenameError: `rename_failed`, to: targetAbsolute });
    if (moveError !== undefined) {
      return moveError;
    }

    return done;
  };

  const moveFile = async ({ directoryPath, path: relativePath }: { directoryPath: string; path: string }) => {
    const sourceAbsolute = resolveUnderRoot(relativePath);
    if (!_.isString(sourceAbsolute)) {
      return sourceAbsolute;
    }
    const targetDirectoryAbsolute = resolveUnderRoot(directoryPath);
    if (!_.isString(targetDirectoryAbsolute)) {
      return targetDirectoryAbsolute;
    }
    const mkdirError = await ensureDirectory({ error: `move_mkdir_failed`, target: targetDirectoryAbsolute });
    if (mkdirError !== undefined) {
      return { error: mkdirError } as const;
    }
    const targetAbsolute = path.join(targetDirectoryAbsolute, path.basename(sourceAbsolute));
    const moveError = await movePath({ from: sourceAbsolute, onRenameError: `move_failed`, to: targetAbsolute });
    if (moveError !== undefined) {
      return moveError;
    }

    return {};
  };

  const deleteFile = async ({ path: relativePath }: { path: string }) => {
    const absolute = resolveUnderRoot(relativePath);
    if (!_.isString(absolute)) {
      return absolute;
    }
    const removeError = await fs.rm(absolute, { force: false, recursive: true }).catch(() => `delete_failed` as const);
    if (removeError !== undefined) {
      return { error: removeError } as const;
    }

    return {};
  };

  return { deleteFile, glob, grep, grepReplace, limits, listDirectory, moveFile, readFile, renameFile, writeFile };
};

export type Workspace = ReturnType<typeof Workspace>;
/* jscpd:ignore-end */
