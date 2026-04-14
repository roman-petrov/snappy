#!/usr/bin/env bun
// cspell:words lancedb
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
import "dotenv/config";
import { Ai, type AiLocale } from "@snappy/ai";
import { Coder } from "@snappy/coder";
import { CoderDb } from "@snappy/coder-db";
import { CoderStore } from "@snappy/coder-store";
import { Console } from "@snappy/node";
import { mkdir } from "node:fs/promises";
import path from "node:path";

import { Ignore } from "./Ignore";
import { t as makeLocaleT } from "./locales";
import { ModelPrompt } from "./ModelPrompt";
import { Progress } from "./Progress";
import { Repl } from "./Repl";
import { Theme } from "./Theme";

try {
  const locale: AiLocale = `ru`;
  const projectRoot = process.cwd();
  const dbDir = path.join(projectRoot, `.snappy/coder/lancedb`);

  await mkdir(dbDir, { recursive: true });

  const projectRootResolved = path.resolve(projectRoot);
  const dbDirResolved = path.resolve(dbDir);
  const aiTunnelKey = process.env[`AI_TUNNEL_API_KEY`] ?? ``;
  const t = makeLocaleT(locale);
  const ai = await Ai({ aiTunnelKey, locale });
  const { chatModel, embeddingModel } = await ModelPrompt.prompt({ models: ai.models, t });
  const db = await CoderDb({ dbDir: dbDirResolved, embeddingModel, ignore: Ignore, projectRoot: projectRootResolved });
  const store = CoderStore({ ignore: Ignore, projectRoot: projectRootResolved });
  const tools = { ...db.tools, ...store.tools };
  const coder = (props: Omit<Parameters<typeof Coder>[0], `locale` | `tools`>) => Coder({ ...props, locale, tools });
  Console.logLine(
    `${Theme.indexStart(t(`startup.indexingStart`))} ${Theme.dim(t(`startup.indexingStatus`))} ${Theme.dim(`(${embeddingModel.source} ${embeddingModel.name})`)}…`,
  );
  let lastIndexedPath: string | undefined;
  const indexStartedAt = performance.now();
  try {
    await db.sync({
      onProgress: progress => {
        if (progress.kind === `file`) {
          lastIndexedPath = progress.path;
          Progress.writeIndexerProgressLine(progress);
        } else {
          const indexDurationMs = Math.max(0, Math.round(performance.now() - indexStartedAt));
          Progress.finishIndexerProgressLine(
            `${Theme.indexReady(t(`startup.ready`))} · ${String(progress.filesIndexed)} ${t(`startup.updated`)} · ${String(progress.filesSkippedUnchanged)} ${t(`startup.unchanged`)} · ${String(progress.chunkCount)} chunks · ${String(indexDurationMs)}ms`,
          );
        }
      },
    });
  } catch (error) {
    Progress.finishIndexerProgressLine(
      `${Theme.warning(t(`startup.indexingFailed`))} ${Theme.dim(`— ${t(`startup.continueWithoutFreshIndex`)}`)}`,
    );
    if (lastIndexedPath !== undefined) {
      Console.errorLine(Theme.error(`${t(`startup.indexingFile`)}: ${lastIndexedPath}`));
    }
    Console.errorLine(Theme.error(error instanceof Error ? error.message : String(error)));
  }

  await Repl.run({ chatModel, coder, projectRoot: projectRootResolved, t });
  db.close();
  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  Console.errorLine(Theme.error(message));
  process.exit(1);
}
