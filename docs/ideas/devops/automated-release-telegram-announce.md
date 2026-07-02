<!-- cspell:word webfactory -->

# 🚀 Automated release: SemVer, AI changelog, Telegram

**Status:** Idea — not implemented.  
**Purpose:** Self-contained implementation spec for an agent working without prior chat context.

---

## 🎯 Goal

After a successful production deploy, automatically:

1. Analyze code changes since the last release (via git diff + repo context, **not** commit messages).
2. Decide the next **SemVer** bump using an AI agent (bump semantics — see SemVer).
3. Publish a formatted **Telegram** post to a product channel.
4. Create and push git tag **`vX.Y.Z`** on the deployed commit.
5. Sync **`runtime-version.json`** on the prod server so Web and Android WebView SPA can read the version via HTTP.

**User experience:** Press **Deploy** in GitHub Actions → build, deploy, health check → separate **release** job runs
`bun do release:publish` → done.

**Failure policy:** If deploy succeeds but release fails, production stays live; the workflow is **red** (user re-runs
only the release job).

---

## 📋 Success criteria

- [ ] `bun do release:publish --dry-run --verbose` works locally (prints version + post, no Telegram/tag/SSH).
- [ ] GitHub Actions: deploy workflow has optional `skip-release` input and a `release` job that depends on `build`.
- [ ] After full deploy: git tag `vX.Y.Z` exists on `github.sha`, Telegram post sent, `GET /api/version` returns SemVer.
- [ ] Re-running release job for an already-tagged commit exits 0 without duplicate Telegram post.
- [ ] Web Settings and Android WebView show the same version from `GET /api/version`.

---

## 🧱 Current repository baseline

- **Deploy** — [`.github/workflows/deploy.yml`](../../../.github/workflows/deploy.yml): manual `workflow_dispatch`, job
  `build`, SSH deploy via [`.github/scripts/deploy.sh`](../../../.github/scripts/deploy.sh)
- **Prod tarball** — excludes `.git`; server cannot run git commands
- **Secrets** — prod secrets in `secrets.prod.enc.yaml`, decrypted with `SECRETS_KEY` in CI
  ([`packages/config/src/ConfigValues.ts`](../../../packages/config/src/ConfigValues.ts))
- **AI** — `@snappy/ai` + `AI_TUNNEL_API_KEY` in prod secrets
- **Telegram** — not implemented; no bot integration yet
- **Versioning** — workspace packages `0.0.0`; manual tags `release-<sha>` exist; no SemVer tags
- **Android** — WebView shell loading `https://snappy-ai.ru/app`
  ([`packages/app-android`](../../../packages/app-android)); same SPA as web
- **Agent stack** — [`@snappy/agent`](../../../packages/agent), [`@snappy/coder-store`](../../../packages/coder-store),
  [`@snappy/coder-cli`](../../../packages/coder-cli) (REPL + LanceDB — **do not use as-is for release**)

---

## 🏗 Architecture

```mermaid
sequenceDiagram
    participant User
    participant BuildJob as build_job
    participant Prod as prod_server
    participant ReleaseJob as release_job
    participant Publish as release_publish
    participant Agent as release_agent
    participant TG as Telegram

    User->>BuildJob: workflow_dispatch Deploy
    BuildJob->>BuildJob: build artifacts
    BuildJob->>Prod: scp + deploy.sh + health check
    Note over Prod: Live on commit ABC<br/>SNAPPY_COMMIT=ABC in pm2
    BuildJob-->>ReleaseJob: needs success
    ReleaseJob->>Publish: bun do release:publish --commit ABC
    Publish->>Publish: clone repo, fetch tags, checkout ABC
    Publish->>Agent: analyze diff vPrev..ABC
    Agent-->>Publish: bump + highlights
    Publish->>Publish: Version.next + Post.format
    Publish->>TG: sendMessage
    Publish->>Publish: git tag vX.Y.Z on ABC, push
    Publish->>Prod: SSH write runtime-version.json
```

### Design principles

1. **All release logic lives in code** — GitHub Actions only orchestrates (extra job + one `run`).
2. **`release:publish` clones the repo itself** — one code path for CI and local; CI checkout is shallow and may lack
   tag history.
3. **Do not run `coder` CLI** — LanceDB index sync is slow; coding prompt and write tools are wrong for this task.
4. **Reuse `@snappy/agent` + read-only `@snappy/coder-store` tools** — same pattern as
   [`packages/coder-cli/src/Repl.ts`](../../../packages/coder-cli/src/Repl.ts).
5. **Agent returns meaning; code formats the Telegram post** — deterministic HTML template.
6. **Tag after deploy** — tag always points at the commit that is already on prod.
7. **Minimum scope** — no CHANGELOG.md, GitHub Releases UI, VERSION file, LanceDB, APK versionName sync in v1.

---

## ⚙️ GitHub Actions changes

**File:** [`.github/workflows/deploy.yml`](../../../.github/workflows/deploy.yml)

### New workflow input

```yaml
on:
  workflow_dispatch:
    inputs:
      disable-cache:
        # ... existing ...
      skip-release:
        description: "Skip release announce and tag"
        required: false
        default: false
        type: boolean
```

### `build` job — one env addition

Pass commit SHA to the server for version API fallback (until `runtime-version.json` is synced):

```yaml
# In SSH deploy step env or deploy.sh:
SNAPPY_COMMIT: ${{ github.sha }}
```

Update [`.github/scripts/deploy.sh`](../../../.github/scripts/deploy.sh):

- Pass `SNAPPY_COMMIT` into the SSH session (alongside `SECRETS_KEY`) from the `build` job
- Start pm2 with `SNAPPY_COMMIT=${SNAPPY_COMMIT}` in the process env (not only on the GitHub runner)

### New job `release`

```yaml
release:
  needs: build
  if: ${{ !inputs.skip-release }}
  runs-on: ubuntu-latest
  environment: production
  permissions:
    contents: write
  env:
    SECRETS_KEY: ${{ secrets.SECRETS_KEY }}
    GITHUB_TOKEN: ${{ github.token }}
    SSH_HOST: ${{ secrets.SSH_HOST }}
    SSH_USER: ${{ secrets.SSH_USER }}
  steps:
    - uses: actions/checkout@v7
    - uses: ./.github/actions/setup-repo
    - uses: webfactory/ssh-agent@v0.10.0
      with:
        ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
    - run: bun do release:publish --commit ${{ github.sha }}
```

Do **not** add release shell scripts under `.github/scripts/`.

---

## 📦 New package: `@snappy/release`

**Path:** `packages/release/`

Add to root `workspaces` (already `packages/*`). Dependencies:

- `@snappy/agent`, `@snappy/coder-store`, `@snappy/ai`, `@snappy/config`, `@snappy/core`, `@snappy/node`, `@snappy/intl`
- `semver`, `zod`

Optional (for `--verbose` local output): export `AgentConsole` from `@snappy/coder-cli` (extract ~40 lines from
`Repl.ts`).

### Module map

- **`Clone.ts`** — clone repo to temp dir, fetch tags, checkout target commit
- **`Git.ts`** — latest `v*` tag (semver sort), `isReleased(commit)`, `tagAndPush`
- **`GitTools.ts`** — agent tools: `git-diff`, `git-changed-files`
- **`Analyze.ts`** — run `Agent()` with release system prompt + tools
- **`Version.ts`** — parse tag → semver; `next(current, bump)`
- **`Post.ts`** — `format({ version, highlights })` → Telegram HTML string
- **`Telegram.ts`** — `send({ token, channelId, text })` via Bot API
- **`SyncProd.ts`** — SSH write `/home/deploy/runtime-version.json` (see path note below)
- **`Secrets.ts`** — load prod secrets when `SECRETS_KEY` is set (pattern:
  [`packages/do/src/Android.ts`](../../../packages/do/src/Android.ts))
- **`Publish.ts`** — orchestrator

Export via barrel `packages/release/src/index.ts`.

---

## 🤖 Release agent

### Why not commit messages

Commit messages in this repo are often uninformative. The agent must inspect **git diff** and **read/grep** relevant
files.

### Tools

**New (release-specific):**

- **`git-diff`** — unified diff between refs; cap ~8k chars per file; skip binary
- **`git-changed-files`** — file list with insertions/deletions

**From `@snappy/coder-store` (read-only subset only):**

- `read-file`, `grep`, `glob`, `list-directory`

**Do not expose:** `write-file`, `grep-replace`, `delete-file`, `move-file`, `rename-file`.

**Do not use:** `@snappy/coder-db` / semantic search (too slow for CI).

**Ignore:** reuse ignore rules from [`packages/coder-cli/src/Ignore.ts`](../../../packages/coder-cli/src/Ignore.ts)
(export or duplicate minimally).

### Structured output — `submit` AgentTool

Agent must call a tool with Zod schema (do not parse free-form JSON from assistant text):

```typescript
type Bump = `patch` | `minor` | `major`;
type Analysis = { bump: Bump; highlights: string[] }; // 3–5 bullets, Russian
```

Include bump semantics from SemVer in the system prompt.

`maxRounds`: 12. Locale: `ru`. Model: `Ai({ aiTunnelKey }).defaults.chat`.

### System prompt (summary)

- Role: Snappy product manager writing for Telegram channel subscribers.
- Task: Analyze changes from `<fromTag>` to `<commit>` using tools; return structured result via `submit` tool.
- Rules: Only facts supported by diff/code; no invented features; ignore merge/chore noise; highlights in **Russian**.

### Console output

- **`--verbose`:** Wire `Agent` client like `Repl.ts` (extract `AgentConsole` from coder-cli with `StatusOutput`).
- **CI / non-TTY:** Log tool names with `Console.logLine` (no spinner).

---

## 📝 Telegram post format (code, not LLM)

**Module:** `Post.format({ version, highlights })`

Deterministic HTML (`parse_mode: HTML`):

- Title: `<b>Snappy v{version} — {short title from first highlight}</b>`
- Bullet list from `highlights` (escape HTML entities in user/LLM text)
- CTA link: `https://snappy-ai.ru/app`
- Stay under Telegram 4096 char limit (truncate highlights if needed)

**Module:** `Telegram.send` → `POST https://api.telegram.org/bot{token}/sendMessage`

---

## 🏷 SemVer

- **Canonical source** — git annotated tags `vX.Y.Z` on deployed commit
- **Baseline if no tags** — `0.0.0`
- **Legacy tags** — ignore `release-<sha>` tags
- **Tag message** — first line = post title

**Bump semantics** (for agent system prompt):

- **patch** — fixes, tweaks, internal refactors with no user-visible change
- **minor** — new features, noticeable UX improvements
- **major** — breaking changes (rare)

`Version.next(current, bump)` uses `semver` package.

---

## 🌐 Production version API

Android app is a **WebView** loading the same SPA — no native version UI needed. Web and Android both fetch the same
endpoint.

### `GET /api/version`

**File:** register route in [`packages/app-server/src/core/App.ts`](../../../packages/app-server/src/core/App.ts)

```typescript
// Response
{ version?: string; commit: string }
```

- Public, no auth
- `Cache-Control: max-age=60`

**Server reads:**

1. `/home/deploy/runtime-version.json` if present **and** `manifest.commit === SNAPPY_COMMIT` env (avoid stale version
   from previous deploy)
2. Fallback `commit` from env `SNAPPY_COMMIT` (set at deploy)
3. Fallback `version`: `undefined` — UI shows short commit

### `runtime-version.json`

**Path on server:** `/home/deploy/runtime-version.json`

**Not** inside `/home/deploy/snappy/` — [`deploy.sh`](../../../.github/scripts/deploy.sh) runs `rm -rf` on that
directory on every deploy, so a manifest there would be deleted before the release job runs.

```json
{ "version": "1.2.3", "commit": "full-sha" }
```

**Written by:** `SyncProd` at end of `release:publish` via SSH (same credentials as deploy).

### Config

Add `RuntimeVersion.read()` in [`packages/config`](../../../packages/config) for server-side read.

### UI (minimal)

One line at bottom of
[`packages/app/src/modules/settings/pages/Settings.view.tsx`](../../../packages/app/src/modules/settings/pages/Settings.view.tsx):

- Fetch `/api/version` in settings state on mount
- Display: `v{version}` if present, else `{commit.slice(0, 7)}`
- Add i18n label in locales

Do **not** bake SemVer into Vite `define`.

### Deploy → release gap (~2–5 min)

After deploy, API may return only `commit`. After release job, API returns `version` — no redeploy required.

---

## 🔐 Secrets

Add to [`packages/config/src/SecretKeys.ts`](../../../packages/config/src/SecretKeys.ts) and
[`secrets.dev.example.yaml`](../../../secrets.dev.example.yaml):

- **`TELEGRAM_BOT_TOKEN`** — from [@BotFather](https://t.me/BotFather)
- **`TELEGRAM_CHANNEL_ID`** — `@channel` or numeric `-100…`; bot must be **channel admin** with post permission

Prod values: `bun do decrypt` → edit `secrets.prod.yaml` → `bun do encrypt` → update GitHub `SECRETS_KEY`.

Existing keys used:

- `SECRETS_KEY`
- `AI_TUNNEL_API_KEY`
- `SSH_*`
- `GITHUB_TOKEN` (CI only)

Document one-time bot setup in README Deploy section.

---

## 🛠 `do` command

**File:** `packages/do/src/commands/ReleasePublish.ts`

```typescript
name: `release:publish`;
mcp: false;
```

**Flags** (parse `process.argv` inside the command `run` — [`main.cli.ts`](../../../packages/do/src/main.cli.ts) does
not forward args today):

- **`--commit <sha>`** — target commit (CI: `github.sha`)
- **`--dry-run`** — run agent, print version + post; no Telegram, tag, or SSH
- **`--verbose`** — agent tool progress (AgentConsole)

Register in [`packages/do/src/CommandRegistry.ts`](../../../packages/do/src/CommandRegistry.ts). Add `@snappy/release`
to [`packages/do/package.json`](../../../packages/do/package.json).

**Orchestrator (`Publish.run`):** Implement the flow from the Architecture sequence diagram.

- **Idempotency:** `Git.isReleased(commit)` → exit 0
- **`--dry-run`:** print version + post; skip Telegram, tag, and SSH
- **Secrets:** `Secrets.prod(root)` when `process.env.SECRETS_KEY` is set (same as Android release build — do not rely
  on `NODE_ENV` alone in CI)
- **Ordering:** Telegram before tag push (see Error handling)

---

## ⚠️ Error handling

- **Deploy OK, release fails** — prod live; workflow red; re-run release job
- **Commit already has `v*` tag** — exit 0, skip all steps
- **Agent fails or never calls `submit`** — retry once; then exit 1
- **Telegram fails** — exit 1; do not create tag
- **Tag push fails** — exit 1
- **Telegram OK, SSH sync fails** — exit 1; tag exists; manifest may be stale until manual fix/re-run
- **`skip-release: true`** — skip release job

**Order:** Telegram → git tag → SSH manifest (tag only after successful Telegram send).

---

## 🚫 Out of scope (v1)

- Semantic search / LanceDB index in CI
- `CHANGELOG.md`, GitHub Releases UI, `VERSION` file in repo
- Running release inside deploy job
- Shell scripts for release under `.github/scripts/`
- Sync Android `versionName` in `build.gradle`
- Separate `release:preview` command (use `--dry-run`)
- Native Android version label (WebView uses SPA + HTTP)

---

## ✅ Implementation checklist (ordered)

1. Add `TELEGRAM_*` to SecretKeys, example yaml, README (manual bot setup).
2. Create `packages/release` with modules above + unit tests for `Version`, `Post`, `Git` tag parsing.
3. Add git AgentTools + `Analyze.ts` with `submit` tool.
4. Optional: extract `AgentConsole` from coder-cli for `--verbose`.
5. Add `do release:publish` command.
6. Add `RuntimeVersion` + `GET /api/version` + Settings UI line + `SNAPPY_COMMIT` in deploy.sh.
7. Update `deploy.yml` — `skip-release` input + `release` job.
8. Verify: `--dry-run --verbose` locally → full deploy → tag + Telegram + `/api/version`.

---

## 🧪 Verification

### Local dry-run

```bash
SECRETS_KEY=<key> bun do release:publish --dry-run --verbose --commit HEAD
```

Expect: printed SemVer, Telegram HTML post, no network side effects (Telegram/tag/SSH skipped).

### After production deploy

- Git tag `vX.Y.Z` on deployed commit
- Telegram channel post visible
- `curl https://snappy-ai.ru/api/version` → `{ "version": "X.Y.Z", "commit": "..." }`
- Settings page shows `vX.Y.Z` in browser and Android WebView

### Idempotency

Re-run release workflow for same commit → exit 0, no duplicate Telegram message.

---

## 📐 Project conventions (must follow)

See [`.cursor/rules/programming.mdc`](../../../.cursor/rules/programming.mdc) and
[`.cursor/rules/typescript.mdc`](../../../.cursor/rules/typescript.mdc):

- Functional modules: `export const Module = { fn1, fn2 }` — no classes
- `type` only, no `interface`
- Arrow functions; pure functions covered by tests where possible
- Reuse existing project utilities; minimal function parameters
- Boolean options optional, default `false`
- Comments in English, only non-obvious logic
- Do not commit `secrets.prod.yaml`; only `secrets.prod.enc.yaml`

---

## 📊 Estimates

- **Release job duration** — 2–5 min (clone + agent rounds + Telegram)
- **AiTunnel cost** — low (one session, ~12 rounds, default chat model)
- **New/changed files** — ~15–20

---

## 🔍 Validation notes (for implementer)

Reviewed against the repo and requirements. Logic is sound; items below were missing or imprecise in earlier drafts and
are now part of the spec.

### Confirmed OK

- Tag-after-deploy order matches prod safety requirements
- Separate `release` job with `needs: build` — correct
- Agent via `@snappy/agent` + read-only `coder-store` (not full `coder` CLI) — correct
- `Post.format` in code + agent only returns `bump` / `highlights` — correct
- `GET /api/version` for Web + Android WebView SPA — correct
- `mcp: false`, prod secrets via `SECRETS_KEY` without relying on `NODE_ENV` in CI — correct
- Idempotency via existing `v*` tag on commit — correct

### Fixed in this doc

- **Manifest path** — must live outside `DEPLOY_PATH` because `deploy.sh` deletes `/home/deploy/snappy` each deploy
- **Stale version** — server must match `manifest.commit` to `SNAPPY_COMMIT` before trusting `manifest.version`
- **`SNAPPY_COMMIT` on server** — must reach pm2 via deploy SSH, not only the GHA runner env
- **CLI flags** — explicit `process.argv` parsing in the command (do CLI has no arg forwarding yet)
- **`do` dependency** — add `@snappy/release` to `packages/do/package.json`
- **Telegram** — HTML escape and length cap

### Still to decide at implementation (minor)

- **First release (no `v*` tag):** diff range = full history capped (~30 commits) or `--root` to first commit; document
  chosen cap in `Git.ts`
- **`Ignore.ts` export:** export from `@snappy/coder-cli` or copy minimal glob list into `release` (prefer export to
  avoid drift)
- **`packages/release/package.json`:** add `vitest` script consistent with sibling packages; wire into root
  `bun do test` if needed
- **Private repo clone URL:** `https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git` in CI;
  locally use existing git remote
- **Annotated tag push:** set git `user.name` / `user.email` for CI before `tagAndPush` (same as typical GHA tag steps)
- **Migration:** first SemVer release after legacy `release-<sha>` tags — baseline `0.0.0`; no automatic conversion of
  old tags

### Known v1 edge case (accepted)

- Telegram OK + tag OK + SSH sync fail → re-run skips (tag exists); fix manifest manually or add a one-off sync command
  later (out of scope)
