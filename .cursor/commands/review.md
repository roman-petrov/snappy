<!-- cspell:words typecheckers oneline lockfiles IIFE subagents dedupe -->

# 🔍 Review: Code Review (Feature Branch or Last Commit)

**Mode:** Run this command in **Plan mode**. If the session is not already in Plan mode, switch to it first
(`SwitchMode` → `plan`), then continue. Do not implement fixes in this command — the deliverable is a plan via
`CreatePlan`.

**Goal:** Thoroughly review either (a) all changes on a **feature branch** vs the base branch, or (b) the **latest
commit** when already on `main` / `master`. Orchestrate **seven parallel category subagents**, merge their findings, and
call **`CreatePlan`** with Summary + Findings + Fix plan + todos. **Do not run linters, typecheckers, or tests** —
analysis only. **Do not edit the codebase** as part of this command.

**How to run (summary):** Confirm Plan mode → resolve review scope → build file list → pack shared context → launch 7
`Task` (`explore`) subagents in parallel (one category each) → merge/dedupe → **`CreatePlan`**. Stop; leave
implementation to a later Agent turn.

---

## 📋 Algorithm (strict step-by-step)

### 1️⃣ Step 1 — Resolve review scope

Detect current branch, then pick **one** of two scopes:

#### A) Feature branch (not `main` / `master`)

- Determine **base**: prefer the merge-base with `main` (or `master` if that is the default).
- Collect scope with git only:
  - `git merge-base HEAD main` (or `master`)
  - `git diff --name-status <base>...HEAD`
  - `git diff <base>...HEAD` (full patch)
  - `git log --oneline <base>..HEAD`
- If there are **no commits / no diff** vs base — stop; nothing to review.

#### B) Base branch (`main` / `master`)

- Review the **latest commit** only (`HEAD` vs its parent).
- Collect scope with git only:
  - `git rev-parse HEAD` and `git log -1 --oneline`
  - `git diff --name-status HEAD~1 HEAD` (if `HEAD` has a parent)
  - `git diff HEAD~1 HEAD` (full patch)
  - For a root commit with no parent: `git diff-tree --no-commit-id --name-status -r HEAD` and
    `git show --format= --patch HEAD`
- If the latest commit has **no file changes** — stop; nothing to review.
- In Summary, label scope as “last commit on `main`” (or `master`) and include the commit SHA/subject — not a
  feature-branch vs base comparison.

**Both scopes:**

- If the user named a **file or folder** with the command — review that path only within the chosen diff.
- Keep referring to the chosen range as `<scope>` in later steps (`<base>...HEAD` for A, `HEAD~1..HEAD` for B).

---

### 2️⃣ Step 2 — Build review file list

- From the scoped diff, list **added / modified** source files (skip delete-only unless a delete may break callers).
- Exclude generated noise when possible (`*.d.ts` for CSS modules, Prisma `generated/`, lockfiles) unless the change is
  hand-written.
- Order: deterministic (e.g. alphabetical by path).

Parent does **not** load convention groups and does **not** review files itself — category subagents own that work.

---

### 3️⃣ Step 3 — Pack shared context

Build a **shared context pack** once (parent only). Include:

- Absolute repository root
- Current branch name
- Scope label: feature branch vs base **or** last commit on `main`/`master` (SHA + subject)
- `<scope>` git range and exact commands to re-read the diff:
  - name-status: `git diff --name-status …`
  - full patch: `git diff …` (or `git show` for root commit)
- `git log --oneline` for the scope
- Ordered file list (from Step 2)
- Optional path filter from the user

If the full patch is too large to embed in every subagent prompt, omit the patch body and instruct each subagent to run
the listed git commands itself. Always include the file list and scope commands.

---

### 4️⃣ Step 4 — Launch seven category subagents (parallel)

In **one** parent turn, launch **seven** `Task` calls with:

- `subagent_type`: `"explore"`
- `thoroughness`: `"very thorough"`
- `description`: short label per category (`review-regressions`, `review-correctness`, …)
- `prompt`: shared context pack + that category’s section from **Category prompts** below + **Subagent output schema**

**Categories (exactly these seven):**

| id                  | Block / conventions                                                |
| ------------------- | ------------------------------------------------------------------ |
| `regressions`       | Block A                                                            |
| `correctness`       | Block B                                                            |
| `dead-unused`       | Block C + load `unused/`                                           |
| `simplify`          | Block D + listed programming atoms                                 |
| `comments`          | Block E + `programming/comments`                                   |
| `reuse`             | Block F + `programming/reuse-existing`                             |
| `stack-conventions` | load `typescript`, `react`, `css`, `testing`, `eslint`, `markdown` |

**Hard constraints (every subagent prompt must repeat):**

- Analysis only — **do not** edit files or apply fixes.
- **Do not** run `eslint`, `tsc`, Vitest, Knip, Stylelint, or `bun do` check workflows.
- **Do not** start the app or hit live endpoints.
- Review **only** this category; ignore other categories.
- Prefer findings tied to this scope’s changes; also flag clear new dead code or convention breaks in touched files.
- Reason from code + call sites + types you can read.

Await all seven results before merging. Do **not** start implementation while waiting.

---

### 5️⃣ Step 5 — Merge, dedupe, risk

1. Collect findings from all seven subagent reports (skip `- none` lines).
2. **Dedupe:** same `path:line` (or same symbol) + same underlying issue → keep one finding.
   - Severity priority when merging duplicates: `regressions` > `correctness` > everything else.
   - On equal severity, keep the more concrete fix wording.
3. Classify each remaining finding:
   - **must-fix** — from `regressions` / `correctness`, or clearly broken behavior
   - **optional cleanup** — dead code, simplify, comments, reuse, stack-convention style
4. Overall risk:
   - 🔴 — any must-fix from regressions/correctness
   - 🟡 — only optional cleanup
   - 🟢 — no findings

Do **not** dump convention checklists into the plan — only concrete findings.

---

### 6️⃣ Step 6 — CreatePlan (mandatory deliverable)

Call **`CreatePlan`** (do not substitute a long chat-only report). Brief status in chat is optional; the plan is
required.

**CreatePlan fields:**

- **name:** e.g. `Review fix plan`
- **overview:** scope label + risk emoji + finding counts (must-fix / optional / total)
- **plan:** markdown body with these sections (lists only, no tables):
  1. **Summary** — scope (feature branch + base + commit count, **or** last commit SHA/subject on `main`/`master`),
     files touched, overall risk, note any failed categories (see Edge cases)
  2. **Findings** — single linear list; each item: emoji + `path:line` (or symbol) + short problem + short fix
  3. **Fix plan** — ordered actionable steps (see format below)
- **todos:** one todo per fix step (`id` + `content`); must-fix first, then optional cleanup. If there are **no
  findings**, set plan text to note “nothing to fix” and either omit todos or use a single `no-fixes-needed` todo.

**Fix plan format (inside CreatePlan body):**

- Ordered steps (1, 2, 3…), grouped by file or by dependency when order matters.
- Each step: what to change, where, and why.
- Prefer **surgical** steps — one concern per step; no drive-by refactors.
- Separate **must-fix** from **optional cleanup** when both exist.
- Keep steps concrete enough that Agent mode can execute them without re-deriving the review.

**Stop after CreatePlan:**

- **Do not** edit files, apply fixes, or start implementation in this turn.
- Remind only if the user asks to apply fixes immediately: `/review` ends at the plan; accept/build or ask to implement
  in Agent mode as a follow-up.

---

## 📤 Subagent output schema (mandatory)

Every category subagent must return **exactly** this shape (markdown, lists only):

```text
## Category: <id>
## Findings
- <emoji> `path:line` — problem → fix
## Notes
- none
```

- If there are no findings: under `## Findings` put a single line `- none`.
- **Emoji rules:**
  - Blocks A–F style findings: use the Block emoji from **Category prompts** / Blocks below.
  - Convention-atom findings: use that atom’s `emoji` field from `conventions/README.md` — do not remap.
- **Notes:** `none`, or short caveats (e.g. uncertain call site). Do not put findings in Notes.

---

## 📨 Category prompts

Parent embeds the matching block below into each `Task` prompt (plus shared context + output schema + hard constraints).
Each subagent that loads conventions must itself: Read `conventions/README.md`, then Glob/Read its groups/atoms per that
protocol, and apply the **applies filter** per file. Parent must **not** paste atom bodies into the prompt.

### `regressions` — Block A

Emoji: 🐛

Compare **old vs new** behavior for every meaningful hunk.

- **What to look for:** Removed / narrowed behavior; changed defaults; missing branches; broken invariants; API shape
  changes without call-site updates; async race / abort / cleanup regressions; incorrect condition flips; off-by-one;
  lost error handling that still matters; UI flows that no longer reach a state.
- **How to detect:** Read diff; follow call sites of changed exports; compare with previous version via
  `git show <parent>:path` when unclear (`<base>` on a feature branch, `HEAD~1` on `main`/`master`).
- **How to fix:** Restore intended behavior or update all call sites consistently; prefer minimal correct fix.
- **Load conventions:** none.

### `correctness` — Block B

Emoji: ✅

- **What to look for:** Logic that cannot work as written; wrong types used at runtime; impossible states; incorrect
  derived data; handlers wired to wrong callbacks; props not forwarded; store/subscription leaks; missing exhaustiveness
  on unions; incorrect `undefined` handling; SSR/client-only misuse.
- **How to detect:** Trace data flow in changed functions; check symmetric operations (add/remove, open/close); verify
  returned objects match consumers.
- **How to fix:** Correct the logic; keep the change as small as possible.
- **Do not:** Run tests or linters to “prove” it — state the reasoning in the finding.
- **Load conventions:** none.

### `dead-unused` — Block C

Emoji: 🗑️ (for Block-framed findings; convention atoms use their own emoji)

- Load group `unused/` (includes `unused/test-only-production`).
- Prefer findings introduced or left unused by the scoped changes.
- **How to fix:** Delete dead code; if a test needs a seam, redesign the test or the minimal public surface.

### `simplify` — Block D

Emoji: ✂️ (for Block-framed findings; convention atoms use their own emoji)

- Load these `programming/` atoms only (not the whole programming group):
  - `kiss-yagni-occam`
  - `inline-one-offs`
  - `dry-single-source`
  - `narrowest-scope`
  - `minimal-params`
  - `no-redundant-context`
- Do **not** load `programming/comments` or `programming/reuse-existing` (other categories own them).
- Review framing: prefer shorter equivalent control flow; drop redundant wrappers, intermediate objects, unnecessary
  generic layers; quantify roughly (“~N lines”) when helpful.

### `comments` — Block E

Emoji: 💬 (for Block-framed findings; atom emoji when from the atom)

- Load atom `programming/comments` only.
- Apply to comments added or left in the scoped diff (obvious, non-English, obsolete, AI narrative; keep linter/cspell
  directives and non-obvious intent).

### `reuse` — Block F

Emoji: 🔧 (for Block-framed findings; atom emoji when from the atom)

- Load atom `programming/reuse-existing` only.
- Flag new helpers in the scoped changes that should reuse an existing project utility / API.

### `stack-conventions`

- Load groups **in order:** `typescript`, `react`, `css`, `testing`, `eslint`, `markdown`.
- Enforce each atom only when its `applies` glob matches the file (or `applies` is `*`).
- Use each atom’s `emoji` on findings.
- Do **not** re-check unused/dead-code, comments, or reuse-existing — other categories cover those.

---

## ⚠️ Edge cases

- **Not in Plan mode** — switch to Plan mode before reviewing; do not review-and-implement in Agent mode under this
  command.
- **On `main` / `master`** — always review the latest commit only; do not refuse because there is no feature branch.
- **Merge commits / messy history on a feature branch** — still review the aggregate `<base>...HEAD` diff, not
  commit-by-commit unless a regression is unclear.
- **Merge commit as `HEAD` on `main`** — still review that commit’s tree vs `HEAD~1` (first parent); note in Summary if
  it is a merge.
- **Generated files** — skip noise; if the scope only updates generated output, say so in Summary and focus on sources.
- **Mixed feature + drive-by** — separate findings and plan steps: required correctness vs optional cleanup.
- **Unsure base branch** (feature-branch scope) — ask the user whether base is `main` or something else before
  reviewing.
- **Category subagent fails** — retry that category **once** with the same prompt. If it still fails, note the failed
  category under Summary/Notes in CreatePlan and continue merging the other six. Do not abort the whole review.
- **User asked to run tests/lint** — that is outside this command; suggest `!check.bat` / MCP workflows separately.
- **User asks to apply fixes immediately** — remind that `/review` ends at CreatePlan; they can accept/build the plan
  (or explicitly ask to implement in Agent mode) as a follow-up.

---

## ✅ Done criteria

- Session is in **Plan mode** for this command.
- Scope resolved (feature branch vs last commit on base) and file list built.
- Seven category `Task` (`explore`) subagents launched in parallel and awaited (with retry rules on failure).
- Findings merged/deduped; risk assigned.
- **`CreatePlan` called** with Summary + Findings + Fix plan (+ todos).
- No linters/tests were executed as part of this command.
- **No code edits** — only analysis and the plan.
