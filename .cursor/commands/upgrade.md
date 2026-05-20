# ⬆️ Upgrade: Package Update with Changelog Review

**Goal:** Menu of outdated packages → upgrade one across the monorepo → project-focused impact report → code changes
only after confirmation.

**Flow:** `bun outdated` → AskQuestion → snapshot → upgrade manifests → Do MCP `tsc`/`test` → research releases
internally → impact report → ask → apply.

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

Wait for selection.

---

### 3️⃣ Snapshot

Before any edits:

- Grep `"<package>"` in root and `packages/**/package.json`
- If in root `patchedDependencies` — warn and wait for confirm before Step 4
- Grep imports (`from "<package>"`, `from "<package>/`) — save file list

---

### 4️⃣ Upgrade

In every manifest: set range to `^<target>` (match pin style of siblings; keep deps vs devDeps).

```bash
bun update <package> --recursive          # in-range
bun update <package> --recursive --latest # major / out-of-range
bun i
```

Confirm `bun.lock` updated and package no longer outdated. No application code in this step.

---

### 5️⃣ Verify

Do MCP `workflow_run` (read `do://instructions`; not terminal scripts): `tsc`, then `test`. On failure — include output
in report; pause until user decides.

---

### 6️⃣ Research (internal only)

Changelog is input for analysis — never paste it in chat. Read every release in `(previousVersion, targetVersion]`, not
only the latest.

1. `bun pm view <package> versions --json` → filter semver range
2. Notes per version (oldest → newest): CHANGELOG, GitHub Releases, `bun pm view <package>@<version>`
3. Grep imports + read Step 3 files → map **APIs we use** × **release changes**

**Report only what affects this codebase:**

- Breaking changes / deprecations in our usage, or already failing `tsc` / `test`
- New APIs that replace boilerplate we maintain (wrappers, workarounds, redundant config)
- Security, perf, or bugfix wins for our usage
- **Simplifications** — local edits that remove or shorten code; ask at each usage site: _"can we write less?"_

**Classify:**

- **Required** — build/tests break; removed or restricted APIs in use
- **Recommended** — deprecations; or local edit that removes/shortens code with low risk
- **Optional** — ≈1–5 lines, marginal; skip unless benefit is obvious

Prefer Recommended over Optional when the upgrade unlocks a shorter replacement. Omit everything else.

---

### 7️⃣ Impact report

Lists, not tables. Each bullet: **where → what → why**. Prefer the option that removes the most code; note line delta
when obvious. At most one link to upstream changelog.

1. **Upgrade summary** (≤4 lines) — `prev → target`, kind, manifests, `tsc`/`test`
2. **Benefits** — wins for our code only; or _"Maintenance bump."_
3. **Risks** — 🔴 blocks · 🟡 watch · 🟢 low; only for changes touching our usage
4. **Required code changes** — 🔴 where / what / why; or _"None."_
5. **Recommended simplifications** — 🟡 deprecated · 🟢 shorter code · 🔵 config; state code to **delete**; main
   value-add when upgrade is clean — explicitly recommend applying items that shorten code
6. **Ask** — _"Apply these changes?"_ with counts (e.g. _2 required, 3 recommended — 2 shorten code_); nudge 🟢 items.
   No code edits before confirm.

---

### 8️⃣ Apply (after confirmation)

- Only report items: Required (§4) first, then Recommended (§5)
- Within each item: delete superseded helpers, wrappers, config — choose the edit that removes the most code; do not
  leave verbose workaround if report proposed a shorter form
- Only named files/symbols; no drive-by refactors, formatting, or unrelated fixes
- Do MCP `tsc` + `test`; summarize in 3–5 bullets with net line reduction

If declined — Step 4 upgrade remains.

---

## ⚠️ Edge cases

- **Patched** — confirm before Step 4; patch may need refresh
- **Version drift** — unify all workspaces to `target`
- **No changelog** — infer from types, failures, release tags
- **Transitive only** — add to manifest, not lockfile alone
- **GitHub Actions** — `bun actions-up`; not this command

---

## 🚫 Do not

- Multiple packages per run; guess versions; skip `bun outdated`
- Changelog dump; upstream changes we do not use
- Code changes without confirmation; scope beyond confirmed report items
- Skip confirmed simplifications because old code still works
- `npm run` / terminal scripts — Do MCP only
