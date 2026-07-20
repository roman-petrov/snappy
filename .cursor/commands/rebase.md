<!-- cspell:word oneline -->

# 🔄 Rebase: Feature Branch onto Main

**Goal:** Rebase a chosen feature branch onto up-to-date `main`, resolve conflicts by carefully reintegrating `main`’s
changes, fix only rebase-caused `tsc`/`test` failures, push the rebased branch, return to `main`.

**Flow:** ensure `main` → AskQuestion (feature branch) → baseline `tsc`/`test` → rebase onto `main` → resolve conflicts
→ `tsc`/`test` (no eslint) → fix rebase regressions only → verify diff → push → checkout `main`.

**Hard constraints:**

- Minimal edits only — no drive-by cleanup, formatting-only churn, or unrelated refactors.
- Prefer keeping feature intent while adopting improvements / API moves from `main`.
- Do **not** run eslint / lint / knip / full `ci` as part of this command.
- Do **not** merge the feature into `main` — only rebase the feature branch onto `main`.

---

## 📋 Algorithm

### 1️⃣ Ensure on `main`

From repo root:

1. `git status` — if the working tree is dirty, stop and ask the user to stash/commit/discard first.
2. `git rev-parse --abbrev-ref HEAD` — must be `main` (or `master` if that is the default; use that name everywhere
   below instead of `main`).
3. If not on `main`: `git checkout main`.
4. Update base: `git fetch origin` then `git pull --ff-only origin main` (or the equivalent tracking pull). If
   fast-forward is impossible — stop and ask the user.

---

### 2️⃣ Menu — pick feature branch

List local feature branches (exclude `main` / `master` and the current checkout name if duplicated):

```bash
git branch --format="%(refname:short)"
```

Optionally also offer remote-only feature branches from `git branch -r` (strip `origin/`, skip `origin/main` /
`origin/master` / `origin/HEAD`) that have no local counterpart.

**AskQuestion:** `Which feature branch do you want to rebase onto main?`

Label: branch name; sort alphabetically. One branch per run.

If the list is empty — stop.

Wait for selection. Call the chosen name `<feature>`.

---

### 3️⃣ Baseline (before rebase)

Checkout the feature branch and capture pre-rebase health so later failures can be classified:

```bash
git checkout <feature>
```

1. Record tip: `git rev-parse HEAD` → `<pre-rebase-sha>`.
2. Record divergence: `git log --oneline main..<feature>` and `git merge-base main <feature>`.
3. MCP `workflow_run`: `tsc`, then `test`. Save the full failure set as **pre-rebase baseline** (file paths + error
   signatures). Do **not** fix anything in this step — baseline only.
4. If `tsc`/`test` cannot run at all (tooling broken) — stop and ask.

---

### 4️⃣ Study `main` changes to reintegrate

Before resolving conflicts, understand what `main` brought since the branch diverged:

```bash
git log --oneline <merge-base>..main
git diff --name-status <merge-base>...main
git diff <merge-base>...main
```

Skim commits and the aggregate diff. Note renames, API moves, deleted symbols, and intentional cleanups that the feature
branch may still use. This context guides conflict resolution — adopt `main`’s improvements instead of blindly keeping
the feature side.

---

### 5️⃣ Rebase onto `main`

```bash
git rebase main
```

On conflicts:

1. List conflicted files (`git status` / `git diff --name-only --diff-filter=U`).
2. For each file: read both sides and the relevant `main` change from Step 4.
3. Resolve by **reintegrating** — keep the feature’s intended behavior **and** fold in `main`’s fixes, renames, and
   cleaner structure. Do not drop either side’s substantive work without a reason stated in the final summary.
4. Stage resolutions; `git rebase --continue` until finished.
5. If a conflict is ambiguous (product decision) — stop, show the conflict, and AskQuestion; do not guess.

If the rebase is already up to date — continue with verify/push steps (still run checks).

Abort path: on unrecoverable mess, `git rebase --abort`, report, leave the branch as before, checkout `main` if needed.

---

### 6️⃣ Verify — `tsc` + `test` (no eslint)

MCP `workflow_run`: `tsc`, then `test`.

Classify failures:

- **New after rebase** (absent from Step 3 baseline) — fix; usually broken imports, renames, API drift from `main`
- **Present in pre-rebase baseline** — leave alone; mention in the summary
- **Present on `main` alone** (optional check: checkout `main`, run same scripts, return) — leave alone

Fix loop: change only what the new failures require → re-run `tsc` then `test` → repeat until no **new** failures remain
(or stop and ask if stuck after a focused attempt).

Do **not** “improve” code that already passed. Do **not** silence failures with broad disables.

---

### 7️⃣ Final diff check

Confirm the rebase result is correct and minimal:

```bash
git log --oneline main..<feature>
git diff --stat main...<feature>
git diff main...<feature>
```

Checks:

- Feature commits sit on top of current `main` (`git merge-base <feature> main` equals `main`).
- Diff vs `main` still expresses the feature — no accidental loss of feature work, no wholesale reintroduction of code
  `main` deliberately removed (unless the feature still needs it and that is justified).
- No unrelated files/noise beyond conflict resolution and rebase-regression fixes.

If something looks wrong — fix surgically or ask; do not push a bad rebase.

---

### 8️⃣ Push rebased branch

Push `<feature>` to `origin`. After a rebase, history rewritten — use lease-safe force:

```bash
git push --force-with-lease origin <feature>
```

If `--force-with-lease` rejects — stop and report; do not fall back to `--force` unless the user explicitly asks.

---

### 9️⃣ Return to `main`

```bash
git checkout main
```

Confirm `git rev-parse --abbrev-ref HEAD` is `main`.

---

### 🔟 Summary

Short report (lists, not tables):

1. **Branch** — `<feature>` rebased onto `main` (`<pre-rebase-sha>` → new tip).
2. **Conflicts** — files resolved; how `main` changes were folded in (one line each if non-trivial).
3. **Checks** — `tsc` / `test`: new failures fixed vs baseline left alone.
4. **Push** — `origin/<feature>` updated (or why not).
5. **Checkout** — back on `main`.

---

## ⚠️ Edge cases

- **Dirty tree** — refuse to start; ask user to clean first
- **Not on `main` at start** — checkout `main` (Step 1); do not rebase while starting from another feature
- **No feature branches** — stop
- **Branch already based on current `main`** — still run Steps 6–9 if the user selected it; note “already up to date”
- **Rebase conflict needs product choice** — AskQuestion; never invent product behavior
- **Pre-existing red `tsc`/`test`** — document; fix only regressions introduced by the rebase
- **Push rejected** — report remote tip; wait for user before any stronger force
- **Detached HEAD / during rebase panic** — `git rebase --abort` if safe, return to `main`, explain )
