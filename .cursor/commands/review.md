<!-- cspell:words typecheckers oneline lockfiles IIFE -->

# 🔍 Review: Code Review (Feature Branch or Last Commit)

**Mode:** Run this command in **Plan mode**. If the session is not already in Plan mode, switch to it first
(`SwitchMode` → `plan`), then continue. Do not implement fixes in this command — the deliverable is a plan.

**Goal:** Thoroughly review either (a) all changes on a **feature branch** vs the base branch, or (b) the **latest
commit** when already on `main` / `master`. Produce a structured findings report and a clear **fix plan**. **Do not run
linters, typecheckers, or tests** — analysis only (read diffs, search, reason about behavior). **Do not edit the
codebase** as part of this command.

**How to run (summary):** Confirm Plan mode → resolve review scope (feature branch vs last commit on base) → load
conventions (groups below) → collect diff → review every changed file against Blocks A–F plus loaded conventions → emit
findings + fix plan. Stop there; leave implementation to a later Agent turn.

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

### 2️⃣ Step 2 — Load conventions

- Read `conventions/README.md` for the load protocol and applies filter.
- Load these groups **in order** (same as `/cleanup`; skip `agent/`):
  1. `unused`
  2. `programming`
  3. `typescript`
  4. `react`
  5. `css`
  6. `testing`
  7. `eslint`
  8. `markdown`
- Loaded atoms replace the former Block G checklist (single source of truth).

---

### 3️⃣ Step 3 — Build review file list

- From the scoped diff, list **added / modified** source files (skip delete-only unless a delete may break callers).
- Exclude generated noise when possible (`*.d.ts` for CSS modules, Prisma `generated/`, lockfiles) unless the change is
  hand-written.
- Order: deterministic (e.g. alphabetical by path). Review **all** files in scope — do **not** stop on first finding
  (unlike `cleanup`).

---

### 4️⃣ Step 4 — Review every file (Blocks A–F + conventions)

For **each** file in the list:

1. Read the file and its hunk in the scoped diff (`git diff <base>...HEAD` or `git diff HEAD~1 HEAD`).
2. Run checks from **Block A → Block F** (below), then every loaded convention that **applies** to the file.
3. Collect every finding. Prefer findings that relate to **this scope’s changes**, but also flag clear new dead code or
   convention breaks introduced or left in touched files.

**Hard constraints:**

- **Do not** run `eslint`, `tsc`, Vitest, Knip, Stylelint, or `bun do` check workflows.
- **Do not** start the app or hit live endpoints unless the user explicitly asks.
- Reason about correctness from code + call sites + types you can read.

---

### 5️⃣ Step 5 — Build findings + fix plan

Compose a **user-facing deliverable** with these sections (lists only, no tables):

1. **Summary** — scope (feature branch + base + commit count, **or** last commit SHA/subject on `main`/`master`), files
   touched, overall risk (🔴 / 🟡 / 🟢).
2. **Findings** — linear list; each item: emoji + where + what + suggested fix.
3. **Fix plan** — ordered, actionable steps to resolve the findings (see format below).

Do **not** dump convention checklists into the report — only concrete findings.

---

### 6️⃣ Step 6 — Output the plan (stop)

- Emit Summary + Findings + Fix plan in chat.
- **Do not** edit files, apply fixes, or start implementation in this turn.
- If there are **no findings**, say so in Summary and skip an empty Fix plan (or note “nothing to fix”).

---

## 📄 Report format (mandatory)

**Findings are a single linear list. Each item MUST start with one emoji:**

- **Blocks A–F** (review-specific): use the Block emoji below.
- **Loaded convention atoms**: use that atom’s `emoji` field (see `conventions/README.md`) — do not remap to another
  symbol.

**Block A–F emojis:**

- 🐛 — Block A: functional regression / likely bug / broken edge case
- ✅ — Block B: correctness concern (logic may be wrong even if not a clear regression)
- 🗑️ — Block C: dead / unused / test-only production code
- ✂️ — Block D: can simplify or shorten
- 💬 — Block E: comments to remove or fix (not ESLint/Stylelint directives)
- 🔧 — Block F: project utility / existing API should be reused

**Each finding:** emoji + `path:line` (or symbol) + short problem + short fix.

### Fix plan format

- Ordered steps (1, 2, 3…), grouped by file or by dependency when order matters.
- Each step: what to change, where, and why.
- Prefer **surgical** steps — one concern per step; no drive-by refactors.
- Separate **must-fix** from **optional cleanup** when both exist.
- Keep steps concrete enough that Agent mode can execute them without re-deriving the review.

---

## 🐛 Block A — Functional regressions

Compare **old vs new** behavior for every meaningful hunk.

- **What to look for:** Removed / narrowed behavior; changed defaults; missing branches; broken invariants; API shape
  changes without call-site updates; async race / abort / cleanup regressions; incorrect condition flips; off-by-one;
  lost error handling that still matters; UI flows that no longer reach a state.
- **How to detect:** Read diff; follow call sites of changed exports; compare with previous version via
  `git show <parent>:path` when unclear (`<base>` on a feature branch, `HEAD~1` on `main`/`master`).
- **How to fix:** Restore intended behavior or update all call sites consistently; prefer minimal correct fix.

---

## ✅ Block B — Correctness (analysis only)

- **What to look for:** Logic that cannot work as written; wrong types used at runtime; impossible states; incorrect
  derived data; handlers wired to wrong callbacks; props not forwarded; store/subscription leaks; missing exhaustiveness
  on unions; incorrect `undefined` handling; SSR/client-only misuse.
- **How to detect:** Trace data flow in changed functions; check symmetric operations (add/remove, open/close); verify
  returned objects match consumers.
- **How to fix:** Correct the logic; keep the change as small as possible.
- **Do not:** Run tests or linters to “prove” it — state the reasoning in the finding.

---

## 🗑️ Block C — Dead, unused, and test-only code

Apply loaded `unused/*` conventions (including `unused/test-only-production`) to touched files.

- Prefer findings introduced or left unused by the scoped changes.
- **How to fix:** Delete dead code; if a test needs a seam, redesign the test or the minimal public surface.

---

## ✂️ Block D — Simplify and shorten

Apply loaded programming/typescript conventions that shorten code (one-offs, YAGNI/Occam, DRY, ternary without IIFE,
simple returns). Review framing:

- Prefer shorter equivalent control flow within the touch-set.
- Drop redundant wrappers, intermediate objects, and unnecessary generic layers.
- **How to fix:** Propose the shorter form; quantify roughly (“~N lines”) when helpful.

---

## 💬 Block E — Comments cleanup

Apply `programming/comments` to comments added or left in the scoped diff (obvious, non-English, obsolete, AI narrative;
keep linter/cspell directives and non-obvious intent).

---

## 🔧 Block F — Project utilities and existing APIs

Apply `programming/reuse-existing` before accepting new helpers in the scoped changes.

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
- **User asked to run tests/lint** — that is outside this command; suggest `!check.bat` / MCP workflows separately.
- **User asks to apply fixes immediately** — remind that `/review` ends at the Fix plan; they can accept/build the plan
  (or explicitly ask to implement in Agent mode) as a follow-up.

---

## ✅ Done criteria

- Session is in **Plan mode** for this command.
- Scope resolved (feature branch vs last commit on base) and all changed files in that scope reviewed against Blocks A–F
  and loaded conventions.
- Deliverable includes **Summary + Findings + Fix plan** (or Summary noting no findings).
- No linters/tests were executed as part of this command.
- **No code edits** — only analysis and the plan.
