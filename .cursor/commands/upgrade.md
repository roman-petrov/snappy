# ⬆️ Upgrade: Package Update with Changelog Review

**Goal:** Menu of outdated packages → upgrade one across the monorepo → project-focused impact report → code changes
only after confirmation.

**Flow:** `bun outdated` → AskQuestion → snapshot → edit manifests → `bun i` → MCP `tsc`/`test` → research releases →
impact report → ask → apply.

---

## 📋 Algorithm

### 1️⃣ Discover

From repo root:

```bash
bun outdated --recursive
```

Parse table rows (`| Package | Current | Update | Latest | Workspace |`). Strip `(dev)`. Ignore `workspace:*`. Aggregate
by unique package name: `current`, `update`, `latest`, `workspaces`, `dev`.

```text
target = update !== current ? update : latest
kind   = target === latest && update === current ? major : in-range
```

Retry with `--no-cache` on failure. Flag version drift across workspaces. Verify stale output via
`bun pm view <package> version`.

If empty — stop; note that major bumps appear only when `Current === Update !== Latest`.

---

### 2️⃣ Menu

**AskQuestion:** `Which package do you want to upgrade?`

Label: `<name>  <current> → <target> (<kind>, <N> workspace[s])`. Sort: major → workspace count desc → name.

Wait for selection. One package per run.

---

### 3️⃣ Snapshot

Before any edits:

- Grep `"<package>"` in `packages/**/package.json` and root `package.json` — list manifests that **already** list the
  package (edit only these; never add the package to a manifest where it is absent)
- In those manifests, note paired `@types` in `devDependencies` if present: `@types/<package>` (unscoped) or
  `@types/scope__name` (scoped, e.g. `@foo/bar` → `@types/foo__bar`)
- If `<package>` appears in root `patchedDependencies` — warn and wait for confirm before Step 4
- Grep imports (`from "<package>"`, `from "<package>/`) — save file list

---

### 4️⃣ Upgrade

In each manifest from Step 3: set range to `^<target>` (match pin style of siblings; keep deps vs devDeps). If paired
`@types` from Step 3 is present — bump it too (`bun pm view @types/… version` → `^<latest>`); same step, no extra ask.
Then:

```bash
bun i
```

Confirm `bun.lock` updated; upgraded package(s) no longer outdated. No application code in this step.

---

### 5️⃣ Verify

MCP `workflow_run`: `tsc`, then `test`. On failure — include output in impact report; pause until user decides.

---

### 6️⃣ Research (internal only)

Changelog is input for analysis — use internally, report only what affects this codebase. Read every release in
`(previousVersion, targetVersion]`, not only the latest. When `@types` was bumped alongside the main package, research the
main package only.

1. `bun pm view <package> versions --json` → filter semver range
2. Notes per version (oldest → newest): CHANGELOG, GitHub Releases, `bun pm view <package>@<version>`
3. Grep imports + read Step 3 files → map **APIs we use** × **release changes**

**Report:**

- Breaking changes / deprecations in our usage, or already failing `tsc` / `test`
- New APIs that replace boilerplate we maintain (wrappers, workarounds, redundant config)
- Security, perf, or bugfix wins for our usage
- **Simplifications** — local edits that remove or shorten code

**Classify:** **Required** (build/tests break) · **Recommended** (deprecations, shorter code) · **Optional** (marginal;
skip unless obvious). Prefer Recommended when the upgrade unlocks a shorter replacement.

---

### 7️⃣ Impact report

Lists, not tables. Each bullet: **where → what → why**. At most one link to upstream changelog.

1. **Upgrade summary** (≤4 lines) — `prev → target`, kind, edited manifests (incl. paired `@types` if bumped), `tsc`/`test`
2. **Benefits** — wins for our code only; or _"Maintenance bump."_
3. **Risks** — 🔴 blocks · 🟡 watch · 🟢 low; only for changes touching our usage
4. **Required code changes** — 🔴 where / what / why; or _"None."_
5. **Recommended simplifications** — 🟡 deprecated · 🟢 shorter code · 🔵 config; state code to **delete**
6. **Ask** — _"Apply these changes?"_ with counts; nudge 🟢 items. Wait for confirmation before code edits.

---

### 8️⃣ Apply (after confirmation)

Apply impact-report items: **Required** (report §4) first, then **Recommended** (report §5). Within each item, delete
superseded helpers, wrappers, config — choose the edit that removes the most code. Only named files/symbols from the
report. MCP `tsc` + `test`; summarize in 3–5 bullets with net line reduction.

If declined — Step 4 upgrade remains.

---

## ⚠️ Edge cases

- **Patched** — `<package>` in `patchedDependencies`; confirm before Step 4; patch may need refresh
- **Version drift** — unify all workspaces to `target`
- **Root-only package** — e.g. `agent-browser` in root `devDependencies`; edit root manifest from Step 3
- **@types-only upgrade** — bump `@types` only; no automatic main-package bump
- **No changelog** — infer from types, failures, release tags
- **Transitive only** — add to the workspace manifest that needs it
- **GitHub Actions** — `bun actions-up`; separate from this command
