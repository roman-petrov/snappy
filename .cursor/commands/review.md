<!-- cspell:word typecheckers oneline lockfiles IIFE subagents dedupe Чеклист -->

# 🔍 Review: Code Review (Feature Branch or Last Commit)

**Mode:** Run this command in **Plan mode**. If the session is not already in Plan mode, switch to it first
(`SwitchMode` → `plan`), then continue. Do not implement fixes in this command — the deliverable is a plan via
`CreatePlan`.

**Goal:** Thoroughly review either (a) all changes on a **feature branch** vs the base branch, or (b) the **latest
commit** when already on `main` / `master`. Orchestrate **seven parallel category subagents**, merge their findings,
load **all** convention groups, then call **`CreatePlan`** with a detailed Russian-language plan: **Краткое резюме** +
**Находки** + **План исправлений** + **Чеклист завершения** + todos. The plan must favor **simplification**, project
conventions, and fixes for **real problems** — never unnecessary code growth. **Do not run linters, typecheckers, or
tests** — analysis only. **Do not edit the codebase** as part of this command.

**How to run (summary):** Confirm Plan mode → resolve review scope → build file list → pack shared context → launch 7
`Task` (`explore`) subagents in parallel (one category each) → merge/dedupe → load conventions → **`CreatePlan`**
(Russian, detailed, with completion checklist). Stop; leave implementation to a later Agent turn.

---

## 📋 Algorithm (strict step-by-step)

### 1️⃣ Step 1 — Resolve review scope

Detect current branch, then pick **one** of two scopes:

#### A) Feature branch (not `main` / `master`)

- Determine **base**: `git merge-base HEAD main` if `main` exists; otherwise `git merge-base HEAD master`.
- Collect scope with git only:
  - `git merge-base HEAD main` (or `master` — same choice as above)
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
- In **Краткое резюме**, label scope as “последний коммит на `main`” (or `master`) and include the commit SHA/subject —
  not a feature-branch vs base comparison.

**Both scopes:**

- If the user named a **file or folder** with the command — review that path only within the chosen diff.
- Keep referring to the chosen range as `<scope>` in later steps (`<base>...HEAD` for A, `HEAD~1..HEAD` for B).

---

### 2️⃣ Step 2 — Build review file list

- From the scoped diff, list **added / modified** source files.
- Include a **deleted** path only when the delete removes a public export/API still referenced outside the deleted file
  (callers may break). Otherwise skip delete-only paths.
- Always exclude: generated `*.d.ts` for CSS modules, Prisma `generated/`, lockfiles.
- Order: alphabetical by path.

Parent does **not** audit files in this step — category subagents do. Parent loads conventions in Step 6a to write the
CreatePlan body and **Чеклист завершения**.

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

If embedding the full patch would exceed a practical prompt size, omit the patch body and require each subagent to run
the listed git commands. Always include the file list and scope commands.

---

### 4️⃣ Step 4 — Launch seven category subagents (parallel)

In **one** parent turn, launch **seven** `Task` calls with:

- `subagent_type`: `"explore"`
- `thoroughness`: `"very thorough"`
- `description`: short label per category (`review-regressions`, `review-correctness`, …)
- `prompt`: shared context pack + that category’s section from **Category prompts** below + **Subagent output schema**

**Categories (exactly these seven):**

| id                  | Block / conventions                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `regressions`       | Block A                                                                                            |
| `correctness`       | Block B                                                                                            |
| `dead-unused`       | Block C + load `unused/`                                                                           |
| `simplify`          | Block D + `programming/` (except `comments`, `reuse-existing`); stack groups as conflict gate only |
| `comments`          | Block E + `programming/comments`                                                                   |
| `reuse`             | Block F + `programming/reuse-existing`                                                             |
| `stack-conventions` | load `typescript`, `react`, `css`, `testing`, `eslint`, `markdown`                                 |

**Hard constraints (every subagent prompt must repeat):**

- Analysis only — **do not** edit files or apply fixes.
- **Do not** run `eslint`, `tsc`, Vitest, Knip, Stylelint, or `bun do` check workflows.
- **Do not** start the app or hit live endpoints.
- Review **only** this category; ignore other categories.
- Report findings only for this scope’s changes and for issues in touched files introduced or left by those changes.
- Reason from code + call sites + types you can read.

Await all seven results before merging. Do **not** start implementation while waiting.

---

### 5️⃣ Step 5 — Merge, dedupe, risk

1. Collect findings from all seven subagent reports (skip `- none` lines).
2. **Dedupe:** same `path:line` (or same symbol) + same underlying issue → keep one finding.
   - Severity priority when merging duplicates: `regressions` > `correctness` > everything else.
   - On equal severity, keep the more concrete fix wording.
3. Classify each remaining finding by **source category only**:
   - **must-fix** — from `regressions` or `correctness`
   - **optional cleanup** — from `dead-unused`, `simplify`, `comments`, `reuse`, `stack-conventions`
4. Overall risk:
   - 🔴 — at least one must-fix
   - 🟡 — no must-fix, at least one optional cleanup
   - 🟢 — no findings

Drop findings marked uncertain in subagent Notes unless the parent can confirm them by reading code/call sites. Do not
put unconfirmed items into **Находки** or **План исправлений**; if still blocked, name them under **Краткое резюме** as
неподтверждённые and omit them from steps.

Findings in the plan must stay **concrete** (path, problem, fix). Do **not** paste atom bodies or list convention ids in
**Находки**. Loaded conventions shape **План исправлений** wording and **Чеклист завершения** (Step 6).

---

### 6️⃣ Step 6 — Load conventions, then CreatePlan (mandatory deliverable)

#### 6a — Load all convention groups (parent)

Before calling `CreatePlan`, the parent **must** load conventions (do not skip; do not rely on memory):

1. Read `conventions/README.md` for the load protocol and applies filter.
2. Load these groups **in order** via Glob + Read every atom file in full:
   1. `agent`
   2. `unused`
   3. `programming`
   4. `typescript`
   5. `react`
   6. `css`
   7. `testing`
   8. `eslint`
   9. `markdown`
3. Use the loaded norms to:
   - Write **План исправлений** steps that do not prescribe convention-violating changes.
   - Prefer simpler / smaller fixes over new abstractions (align with `agent/simplicity-first`,
     `programming/kiss-yagni-occam`, `programming/inline-one-offs`, `programming/reuse-existing`).
   - **Conventions over simplification:** drop any `simplify`-sourced finding whose proposed fix would violate an
     applicable loaded atom (`applies` filter). Do not put those items in **Находки** or **План исправлений**.
   - Fill **Чеклист завершения** so the later implementer verifies applicable atoms (`applies`) for every file the
     planned fixes touch.
   - Keep planned scope surgical (`agent/surgical-changes`, `agent/simplicity-first`, `agent/goal-driven`).

Do **not** copy atom text into the plan. Do **not** list convention ids in **Находки**.

#### 6b — CreatePlan

Call **`CreatePlan`** (do not substitute a chat-only report).

**Language (mandatory):** `overview`, full `plan` body, and every `todos[].content` — **Russian**. Subagent output may
be English; parent rephrases into Russian in CreatePlan. This command file stays English.

**Quality bar (mandatory):**

- Concrete and unambiguous steps — forbid soft hedges in step text: “при необходимости”, “по желанию”, “A или B”,
  “опционально если…”.
- “Optional cleanup” is only a **severity class**, never soft wording inside a step.
- Each step: file + location (line and/or symbol) + exact change + short why.
- Order: all must-fix steps first (by dependency, then by file path), then all optional-cleanup steps (same order
  rules).
- One concern per step; no drive-by refactors.
- Agent mode must be able to execute the plan without re-deriving the review.

**Simplification bias (mandatory):**

- The whole plan must aim to **simplify** code, apply project conventions, and fix **real** regressions/correctness
  problems — not to grow the codebase.
- Prefer: delete dead code, inline one-offs, reuse existing APIs, narrower scope, smaller diffs.
- Forbid plan steps whose main effect is adding helpers, wrappers, indirection, “future-proof” layers, or extra files
  without fixing a concrete finding.
- If a correct fix and a larger/more abstract fix both work, keep only the smaller correct fix in the plan.
- Drop optional-cleanup findings that only rearrange code without net simplification or a convention fix.
- **Conventions outrank simplification:** never plan a `simplify` step whose fix would violate an applicable convention
  atom. If shorter code and a convention conflict, keep the convention-compliant shape.

**CreatePlan fields:**

- **name:** `План исправлений по review`
- **overview:** Russian — scope + risk emoji + counts: must-fix / optional cleanup / total
- **plan:** markdown body with **exactly these four sections, in this order** (lists only, no tables):
  1. **Краткое резюме** — scope (feature branch + base + commit count, or last commit SHA/subject on `main`/`master`),
     files touched, risk, failed categories if any
  2. **Находки** — one linear list; each item: emoji + `` `path:line` `` (or symbol) + problem → fix. If none: one line
     `- нет`
  3. **План исправлений** — see format below
  4. **Чеклист завершения** — see fixed checklist below
- **todos:** one todo per numbered fix step (`id` + Russian `content`); must-fix todos first. If no findings: one todo
  `id: no-fixes-needed`, `content: Исправления не требуются`.

**План исправлений format:**

- If there are findings: two subsections when both classes exist, in this order:
  1. **Обязательные (must-fix)** — numbered steps `1…N`
  2. **Опциональная зачистка (optional cleanup)** — continue numbering `N+1…`
- If only one class exists: that subsection only, still numbered from `1`.
- If no findings: one line `Исправления не требуются.` (no subsections).
- Every step: what / where / why — Russian; one concern; surgical.

**Чеклист завершения (mandatory; fixed items; Russian checkboxes):**

This section is for the agent that **implements** the plan later — not for the `/review` turn. Copy the eight items
below **verbatim** into CreatePlan. Do not drop, reorder, or rewrite them. Parenthetical `N/A` clauses are the only
allowed skip conditions when implementing.

- [ ] Все шаги **Обязательные (must-fix)** выполнены (N/A — таких шагов не было)
- [ ] Все шаги **Опциональная зачистка** выполнены (N/A — таких шагов не было; либо пользователь в этом чате явно
      отказался от опциональной зачистки)
- [ ] Diff содержит только изменения из шагов плана — без посторонних правок
- [ ] Правки упрощают код или устраняют реальную проблему / нарушение conventions; нет лишних абстракций, обёрток и
      файлов «на вырост»
- [ ] Для каждого файла, изменённого при выполнении плана, прогнаны Detect-проверки всех применимых atoms из групп
      `unused`, `programming`, `typescript`, `react`, `css`, `testing`, `eslint`, `markdown` (фильтр `applies`)
- [ ] Scope правок соответствует `agent/surgical-changes`, `agent/simplicity-first`, `agent/goal-driven`
- [ ] После выполнения шагов плана прогнан check-workflow через MCP `project-0-snappy-do` / `workflow_run` (N/A — шагов
      плана не было: `Исправления не требуются`)
- [ ] В изменённом коде нет TODO/заглушек, не закрытых отдельным шагом плана

**Stop after CreatePlan:**

- Do **not** edit files, apply fixes, or start implementation in this turn.
- If the user asks to apply fixes immediately: reply that `/review` ends at CreatePlan; implementation is a separate
  Agent-mode follow-up.

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
- **Notes:** `none`, or a short caveat. Put uncertain items only in Notes (not under Findings). Parent applies Step 5
  rules for unconfirmed Notes.
- Subagent text may be English; the parent rephrases into Russian in CreatePlan.

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
- **How to fix:** If the new behavior is intended, update every broken call site to the new contract; otherwise restore
  the previous behavior. State which case in the finding. Keep the diff minimal.
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
- Report unused/dead code introduced or left unused by the scoped changes.
- **How to fix:** Delete dead code. For `unused/test-only-production`: remove the production seam and change the test to
  use a supported public API (do not keep test-only production exports).

### `simplify` — Block D

Emoji: ✂️ (for Block-framed findings; convention atoms use their own emoji)

- Load the **entire** `programming/` group per `conventions/README.md`, then **skip** only:
  - `programming/comments`
  - `programming/reuse-existing`
- Enforce every other atom in `programming/` (including atoms added to the group later).
- Flag: redundant control flow, wrappers, intermediate objects, unnecessary generic layers. When removing code, state
  approximate lines removed (e.g. `~12 lines`).
- **Conventions over simplification (mandatory):** Project conventions outrank making code shorter. Before reporting a
  finding, verify the **proposed fix** would not violate any applicable atom for that file:
  1. Atoms already loaded in this category (`programming/` minus the two skips above).
  2. Stack groups loaded **only as a conflict gate** (do **not** report stack violations here — that is
     `stack-conventions`): `typescript`, `react`, `css`, `testing`, `eslint`, `markdown`. Read `conventions/README.md`,
     Glob/Read each group in full, apply the `applies` filter per file. If a candidate conflicts with any such atom,
     **drop it** — omit from Findings. Optionally under Notes: `dropped: convention conflict` + path/symbol. Never
     promote a convention-conflicting simplification to Findings.

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
- Do **not** re-check unused/dead-code, comments, reuse-existing, or other `programming/` atoms — other categories cover
  those. Do **not** audit `agent/` here (`agent/` is behavioral; parent uses it when writing the plan).

---

## ⚠️ Edge cases

- **Not in Plan mode** — switch to Plan mode before reviewing; do not review-and-implement in Agent mode under this
  command.
- **On `main` / `master`** — always review the latest commit only; do not refuse because there is no feature branch.
- **Merge commits / messy history on a feature branch** — review the aggregate `<base>...HEAD` diff only. Use
  `git show <parent>:path` for a single hunk when old behavior is unclear; do not review commit-by-commit.
- **Merge commit as `HEAD` on `main`** — review that commit’s tree vs `HEAD~1` (first parent); note in **Краткое
  резюме** that HEAD is a merge.
- **Generated files** — exclude per Step 2; if the scope only updates generated output, say so in **Краткое резюме** and
  CreatePlan with no source findings (`Исправления не требуются`).
- **Mixed feature + drive-by** — classify and plan must-fix vs optional cleanup per Step 5 only.
- **Neither `main` nor `master` exists** (feature-branch scope) — ask the user for the base branch before reviewing; do
  not guess.
- **Category subagent fails** — retry that category **once** with the same prompt. If it still fails, note the failed
  category under **Краткое резюме** and continue merging the other six. Do not abort the whole review.
- **User asked to run tests/lint during `/review`** — refuse for this command; point to MCP `workflow_run` after
  implementation.
- **User asks to apply fixes immediately** — same as Stop after CreatePlan: `/review` ends at CreatePlan; implementation
  is a separate Agent-mode follow-up.

---

## ✅ Done criteria

- Session is in **Plan mode** for this command.
- Scope resolved (feature branch vs last commit on base) and file list built.
- Seven category `Task` (`explore`) subagents launched in parallel and awaited (with retry rules on failure).
- Findings merged/deduped; risk assigned.
- Parent loaded all convention groups (`agent`, `unused`, `programming`, `typescript`, `react`, `css`, `testing`,
  `eslint`, `markdown`) per `conventions/README.md` before CreatePlan.
- **`CreatePlan` called** with Russian Overview + **Краткое резюме** + **Находки** + **План исправлений** + **Чеклист
  завершения** (+ todos).
- Plan steps are concrete and unambiguous; completion checklist is present and strict.
- Plan favors simplification / conventions / real fixes — no unnecessary code growth; conventions outrank simplification
  (no plan steps that violate applicable atoms).
- No linters/tests were executed as part of this command.
- **No code edits** — only analysis and the plan.
