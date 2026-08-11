<!-- cspell:word upgradelock navigations -->

# ⬆️ Upgrade: Bulk Dependency Update

**Goal:** Upgrade all outdated direct dependencies (except `upgradelock`) to latest → green lint/test → safe
changelog-driven simplifications (including cosmetic ones that shorten code) → browser smoke → `ci` → detailed report.
No commit.

**Flow:** credentials → `upgradelock` + `bun outdated` → bulk `bun update --latest` → MCP `lint`/`test` → per-package
changelog pass (apply safe simplifies) → `bun do dev` + browser smoke → MCP `ci` → final report.

**Hard constraints:**

- Do **not** commit or push.
- Do **not** upgrade packages listed in root `upgradelock`.
- Do **not** touch `workspace:*` ranges.
- Do **not** run `bun actions-up` / GitHub Actions upgrades — separate from this command.
- Code edits: **Required** (to pass checks) + **Safe simplify** from changelogs for our usage — including safe cosmetic
  updates when they shorten/simplify code. No AskQuestion for those.
- Ask for local DB user credentials **before** any upgrades; block until answered.
- Prefer MCP `workflow_run` for `lint`, `test`, `tsc`, `ci`. Use shell for `bun outdated` / `bun update` / `bun i` /
  `bun do dev` (and other package-manager commands).

---

## 📋 Algorithm

### 0️⃣ Credentials (blocker)

Ask the user for the local DB user’s login and password. Do not proceed until both are provided. Keep them only for Step
5 smoke login.

---

### 1️⃣ Lock + discover

From repo root:

1. Read `upgradelock`: one package name per line; ignore blank lines and `#` comments.
2. Run:

```bash
bun outdated --recursive
```

Retry with `--no-cache` on failure.

1. Parse table rows (`| Package | Current | Update | Latest | Workspace |`). Strip `(dev)` from the name (keep a `dev`
   flag). Ignore rows whose resolved range is `workspace:*`. Aggregate by unique package name: `current`, `update`,
   `latest`, workspaces, `dev`.

```text
target = latest
kind   = major if crossing major(current → latest), else minor/patch
```

1. Drop every name present in `upgradelock` (record them as skipped-by-lock).
2. If the remaining candidate list is empty — stop with a short “nothing to upgrade” report (still note lock skips).
3. If any candidate appears in root `patchedDependencies` — warn and **AskQuestion** before Step 2: upgrade (may need
   patch refresh) or skip for this run. Wait for the answer.
4. Note paired `@types` in manifests that already list a candidate: `@types/<pkg>` or `@types/scope__name` for
   `@scope/name`. Include those `@types` packages in the update set when present (unless locked).

Do **not** use Bun `--filter` to honor `upgradelock` — that flag filters workspaces, not dependency names.

---

### 2️⃣ Bulk upgrade

One pass for all candidates (and paired `@types` from Step 1):

```bash
bun update --latest --recursive <pkg1> <pkg2> ...
bun i
```

Verify:

- `bun.lock` changed as expected
- locked packages stayed on their previous versions
- candidates are no longer outdated (or record leftovers)

No application code changes in this step. Record `prev → new` per upgraded package for later steps.

---

### 3️⃣ Verify (lint + test)

MCP `workflow_run`: `lint`, then `test`.

On failure — fix only breakages caused by the upgrade (**Required**). Re-run until green, or stop and explain if the
user must choose (e.g. incompatible major with no clear migration).

---

### 4️⃣ Per-package changelog pass

Only packages whose version actually moved. Prefer packages with our import surface and breaking/deprecations first;
pure maintenance with no usage — note briefly and skip deep refactor.

For each package (`name`, `prev`, `new`):

1. Read every release in `(prev, new]` (oldest → newest): CHANGELOG, GitHub Releases, `bun pm view`. When `@types` was
   bumped with a main package, research the main package only.
2. Grep our usage: `from "<package>"`, `from "<package>/`.
3. Map APIs we use × release notes. Classify:

- **Required** — fix now if still broken after Step 3
- **Safe simplify** — apply immediately: remove workarounds, switch deprecated → shorter API, drop redundant
  wrappers/config, **and safe cosmetic updates that simplify code** (shorter call, fewer options/noise, clearer API,
  same behavior)
- **Watch / note** — report only: risk, contested behavior, UX benefit with no code simplification, or purely aesthetic
  change that does not shorten/simplify

**Apply rules:** surgical; only files/symbols from our usage; prefer deleting code; apply cosmetic edits only when they
truly simplify; no new abstractions; do not change UX “for taste”. After a batch of edits for a package, run MCP `tsc`
and/or `test` when risk warrants it.

No AskQuestion before applying **Required** or **Safe simplify**.

---

### 5️⃣ Browser smoke

1. Shell: `bun do dev` (needs Docker/DB; MCP `dev` is unavailable).
2. Browser: `https://home.local` (site) and `https://home.local/app` (app).
3. Log in with credentials from Step 0.
4. Minimal smoke: no console/network errors on load; login succeeds; one or two basic navigations (site landing + app
   after login).
5. Environment blockers (cert/Docker/DB) — stop with concrete fix steps; do not fake success.

---

### 6️⃣ Final CI

MCP `workflow_run`: `ci` (same as `bun do ci`). Fix and re-run until green.

---

### 7️⃣ Final report

Lists, not tables. Each bullet: **where → what → why** when describing code/UX. Sections:

1. **Upgrade summary** — count upgraded; skipped-by-lock; patched skipped/confirmed; lint / test / ci / smoke outcome
2. **Version changes** — `name: prev → new` (mark majors)
3. **Code improvements** — what was simplified/removed and why (incl. cosmetic simplifies)
4. **UX / product benefits** — user-facing wins, or _"Maintenance only."_
5. **Watch list** — what to verify in manual testing
6. **Left untouched** — lock list, declined patched, Actions
7. Explicit line: **No commit created.**

If the git tree was already dirty before this command — mention it; do not stop for that reason.

---

## ⚠️ Edge cases

- **Patched** — confirm before upgrading; patch may need refresh
- **Version drift** — after `--latest --recursive`, versions should unify; if not, align manually to `latest`
- **@types-only** — bump `@types` alone when that package is the outdated candidate; do not auto-bump the main package
- **No changelog** — infer from types, failures, release tags
- **Transitive-only desire** — out of scope unless already a direct dependency
- **GitHub Actions** — `bun actions-up`; not part of this command
- **Smoke without credentials** — forbidden; Step 0 is mandatory
