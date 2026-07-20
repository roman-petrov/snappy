<!-- cspell:words typecheckers oneline lockfiles IIFE -->

# 🔍 Review: Feature Branch Code Review

**Goal:** On a **feature branch**, thoroughly review all changes vs the base branch. Produce a structured report and
propose fixes. **Do not run linters, typecheckers, or tests** — analysis only (read diffs, search, reason about
behavior).

**How to run (summary):** Confirm feature branch → load rules → collect branch diff → review every changed file against
Blocks A–G → emit full report → ask before applying fixes.

---

## 📋 Algorithm (strict step-by-step)

### 1️⃣ Step 1 — Confirm branch context

- Current branch must **not** be `main` / `master`. If on a base branch — stop and tell the user.
- Determine **base**: prefer the merge-base with `main` (or `master` if that is the default).
- Collect scope with git only:
  - `git merge-base HEAD main` (or `master`)
  - `git diff --name-status <base>...HEAD`
  - `git diff <base>...HEAD` (full patch)
  - `git log --oneline <base>..HEAD`
- If the user named a **file or folder** with the command — review that path only within the branch diff.
- If there are **no commits / no diff** vs base — stop; nothing to review.

---

### 2️⃣ Step 2 — Load rules

- Read **all** files in `.cursor/rules/` (`.mdc`, `.md`).
- Rules are the single source of truth for Block G (convention checklist).
- Also skim commonly reused project APIs when Block F applies: `@snappy/core` (`_`, `Time`, `DateTime`, `Json`, …),
  `@snappy/theme` (SCSS tokens/mixins), `@snappy/ui`, `@snappy/hooks`, `@snappy/browser`, package barrels.

---

### 3️⃣ Step 3 — Build review file list

- From the branch diff, list **added / modified** source files (skip delete-only unless a delete may break callers).
- Exclude generated noise when possible (`*.d.ts` for CSS modules, Prisma `generated/`, lockfiles) unless the change is
  hand-written.
- Order: deterministic (e.g. alphabetical by path). Review **all** files in scope — do **not** stop on first finding
  (unlike `cleanup`).

---

### 4️⃣ Step 4 — Review every file (Blocks A–G)

For **each** file in the list:

1. Read the file and its hunk in `git diff <base>...HEAD`.
2. Run checks from **Block A → Block G** (top to bottom). Use grep/search when needed; do not rely on memory.
3. Collect every finding. Prefer findings that relate to **this branch’s changes**, but also flag clear new dead code or
   convention breaks introduced or left in touched files.

**Hard constraints:**

- **Do not** run `eslint`, `tsc`, Vitest, Knip, Stylelint, or `bun do` check workflows.
- **Do not** start the app or hit live endpoints unless the user explicitly asks.
- Reason about correctness from code + call sites + types you can read.

---

### 5️⃣ Step 5 — Build report

Compose a **user-facing report** with these sections (lists only, no tables):

1. **Summary** — branch name, base, commit count, files touched, overall risk (🔴 / 🟡 / 🟢).
2. **Findings** — linear list; each item: emoji + where + what + suggested fix.
3. **Ask** — whether to apply the proposed fixes.

Do **not** dump the entire Block G checklist into the report — only concrete findings.

---

### 6️⃣ Step 6 — Output and ask

- Emit the full report in chat.
- Ask: _"Apply these fixes?"_ (or apply a subset if the user specifies).
- **Do not** change the codebase until the user confirms.
- After confirmation: apply only named fixes; keep changes surgical; re-read touched files for consistency.

---

## 📄 Report format (mandatory)

**Findings are a single linear list. Each item MUST start with one emoji from this set:**

- 🐛 — functional regression / likely bug / broken edge case
- ✅ — correctness concern (logic may be wrong even if not a clear regression)
- 🗑️ — dead / unused / test-only production code
- ✂️ — can simplify or shorten
- 💬 — comments to remove or fix (not ESLint/Stylelint directives)
- 🔧 — project utility / existing API should be reused
- 📐 — project convention / rule violation
- 📝 — naming
- ⚛️ — React / View-State
- 🎨 — CSS / theme
- 🧪 — tests structure (in test files only)

**Each finding:** emoji + `path:line` (or symbol) + short problem + short fix.

**Example:**  
`✂️`**`packages/app/src/Foo.ts:42`** — One-off `const label = …` used once. → Inline into the return.

---

## 🐛 Block A — Functional regressions

Compare **old vs new** behavior for every meaningful hunk.

- **What to look for:** Removed / narrowed behavior; changed defaults; missing branches; broken invariants; API shape
  changes without call-site updates; async race / abort / cleanup regressions; incorrect condition flips; off-by-one;
  lost error handling that still matters; UI flows that no longer reach a state.
- **How to detect:** Read diff; follow call sites of changed exports; compare with previous version via
  `git show <base>:path` when unclear.
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

- **Unused exports / functions / types / params / imports** introduced or left unused by the branch.
- **Unreachable code** after `return` / `throw` / impossible conditions.
- **Commented-out code** blocks.
- **Test-only code in production modules** — helpers, flags, stubs, or branches that exist solely to satisfy tests and
  are not part of the product API (e.g. `export for tests`, `__test__` hooks, dead `if (process.env.TEST)`). Prefer
  testing through the public API; move truly needed seams to a minimal, intentional design.
- **CSS** unused classes/vars/mixins in touched stylesheets (grep references).
- **How to fix:** Delete dead code; if a test needs a seam, redesign the test or the minimal public surface — do not
  leave production noise.

---

## ✂️ Block D — Simplify and shorten

- Inline **one-off** variables/functions (used once).
- Remove speculative / “future” abstractions (YAGNI).
- Collapse duplicate logic (DRY) within the branch touch-set.
- Prefer shorter equivalent control flow (see Block G: ternary without IIFE).
- Prefer **simple object returns** with locals above (see Block G).
- Drop redundant wrappers, intermediate objects, and unnecessary generic layers.
- **How to fix:** Propose the shorter form; quantify roughly (“~N lines”) when helpful.

---

## 💬 Block E — Comments cleanup

Review **comments added or left** in the branch diff:

- Remove **obvious** comments (restating the code).
- Remove or rewrite **non-English** comments → English only, or delete.
- Remove **obsolete** comments that no longer match the code.
- Remove **AI / narrative** comments (“ensure that…”, step-by-step essays).
- **Keep:** ESLint / Stylelint / cspell directives (`eslint-disable`, `stylelint-disable`, `cspell:…`).
- **Keep:** Non-obvious intent, constraints, or non-trivial algorithms (short English).
- **How to fix:** Delete or rewrite; do not add new commentary unless truly needed.

---

## 🔧 Block F — Project utilities and existing APIs

Before accepting new helpers in the branch:

- Search for an existing function in `@snappy/core` (`_`: `cn`, `clamp`, `kebabCase`, `isString`, …; `Time`, `DateTime`,
  `Json`, `Translate`, …), `@snappy/hooks`, `@snappy/browser`, `@snappy/ui`, and the current package.
- Prefer theme tokens/mixins (`@snappy/theme`) over hardcoded SCSS values.
- Prefer package **barrel** imports over deep file paths.
- Prefer existing UI primitives over one-off markup/CSS.
- **How to fix:** Replace local reinvention with the project API; delete the duplicate helper.

---

## 📐 Block G — Project rules checklist (validate all)

Use this list when reviewing. Report only violations found. Sources: `.cursor/rules/*` and repo ESLint intent.

### Philosophy & structure

1. Prefer the **simplest** solution; no speculative features or flexibility.
2. **DRY** — no duplicated logic; extract or reuse.
3. **YAGNI** — no code “for later”.
4. **KISS** — keep compact and readable.
5. **No OOP / no classes** — functions and modules only.
6. Prefer **pure functions**; side effects at clear boundaries.
7. Prefer **immutability**; avoid mutation when possible.
8. **Occam’s razor** — delete anything unnecessary.
9. Keep functions **small and single-purpose**.
10. **Surgical diffs** — don’t “improve” unrelated code in the same fix set unless the user asked.

### Unused & parameters

1. Remove unused variables, imports, parameters, types, exports.
2. Functions take **only** parameters they use (no fat objects for one field).
3. Object param used for **1 field** → pass a scalar.
4. Object param used for **2+ fields** → small dedicated input type.
5. Boolean params/props are **optional** with default **`false`** (not required, not default `true`).
6. Inline **one-off** variables and functions (single use).

### Naming

1. Function names: no auxiliary verbs **`get` / `create` / `make` / `calculate` / `compute`**.
2. No **`utils` / `utilities` / `util` / `helper` / `manager` / `wrapper` / `factory`** in names.
3. **No redundant context** in child names (inside `sendMessage` prefer `text`, not `messageText`).
4. Types: `PascalCase`; regular vars: `camelCase`; **exported values**: `PascalCase`; params/props methods: `camelCase`.
5. No leading/trailing `_` except unused parameters.
6. Files: **PascalCase** `.ts`/`.tsx`; exceptions: `main`, `index`, `entry-*`, `locales/**`; hooks files **camelCase**
   (`useThing.ts`).
7. Handlers in View/State: imperative names (`setText`, `clear`) — **no `on` prefix** in state; view wires
   `onClick={clear}`.

### Comments

1. Comments only for **non-obvious** points.
2. Comment language: **English**.
3. No commented-out code.
4. Do not remove/alter **linter directive** comments in Block E cleanup.

### TypeScript style

1. Use **`type`**, never `interface`.
2. **Infer types** from values (`as const`, `typeof`, `ReturnType`, `Parameters`) when possible.
3. Omit annotations the compiler already infers.
4. Use **`undefined`**, not `null`.
5. **Arrow functions** everywhere (no `function` declarations).
6. **Destructure parameters** when reading fields: `({ a, b }: T)` — exception: whole object only forwarded.
7. **Destructure assignments**: `const { a, b } = obj` instead of `const x = obj` then `x.a`.
8. Comparisons: only **`===` / `!==`**.
9. Every `if` / `else` / `else if` uses **curly braces**.
10. No module-level **`let`** (only inside factory closures when needed).
11. Max practical parameter count; avoid long positional lists (project ESLint max is 5).
12. Prefer `import { type X }` / inline type imports consistently with the codebase.
13. Avoid magic numbers — extract named constants (except common allowlisted literals).

### Control flow & returns (important)

1. Prefer **single `return` with ternary** over multiple `if (…) return …` when branches are expressions.
2. **Never introduce an IIFE** to force a ternary (`return cond ? (() => { … })() : …`). If the branch needs statements
   / `await` / multiple lines — keep `if` / `return`.
3. Prefer **simple returns of local names**:

   ```ts
   const field1 = …;
   const field2 = …;
   const field3 = …;
   return { field1, field2, field3 };
   ```

   not large inline object literals with nested logic, and not renaming in the return (`return { onSubmit: process }` —
   return `process` under the same name).

4. Do not declare **functions or heavy expressions inside `return { … }`**; define locals above, return names / spreads.
5. Prefer early clarity without unnecessary nesting; don’t add IIFEs for “expression purity”.

### Modules & barrels

1. Pure module: **`export const ModuleName = { fn1, fn2 }`** — no individual function exports (except rare global
   helpers like `t`).
2. Factory: deps as **object**; `export type ModuleNameConfig`; local `const` methods then `return { … }`;
   `export type ModuleName = ReturnType<typeof ModuleName>`.
3. **Barrel** `index.ts` in directories: only `export * from "./File"` / `./folder` — no named re-exports of
   individuals.
4. **Import from barrels** (package or directory), never from concrete sibling files when a barrel exists.
5. Parent barrels re-export children.

### React

1. **One component per file**.
2. Export props type as **`ComponentNameProps`**.
3. Wrapper props: **`Omit<ChildProps, …> & { … }`**, don’t re-list child props by hand.
4. Hook modules live under a **`hooks/`** directory; hook file names camelCase.
5. Class name prop: **`cn`**, compose with `_.cn(...)` — not `className` on our components’ public props.
6. Use View/State split when there is logic/state that uses props; skip when trivial/presentational.

### View / State

1. **Entry**: only props type + `useState` + view — no layout JSX, no logic.
2. **State**: all logic/hooks/handlers; **no JSX**; no CSS modules; no `t(...)`.
3. **View**: JSX only; **no hooks**; no business conditionals/computed values; `t(...)` and CSS modules here.
4. View props type: **`ReturnType<typeof useComponentState>`** (not hand-duplicated).
5. Entry: `<View {...useState(props)} />`.
6. Pass-through props: `...rest` in state return.
7. State return stays flat: names and spreads only (see items 43–44).

### CSS / theme

1. No hardcoded colors, font sizes, spacing, radii, shadows, transitions — use `@snappy/theme`.
2. No raw `var(--…)` in component SCSS — theme functions/mixins.
3. No new component-level CSS custom properties — extend the theme instead.
4. File-private SCSS vars: `$-name`.
5. Sizes in **rem**; borders may use **px**.
6. Class names: **kebab-case**.
7. Avoid raw **`z-index`** — DOM order / `position` / `@snappy/theme` layer mixins.

### Testing (test files)

1. Destructure object-of-functions module under test at top; call `fn()` without module prefix.
2. Top-level `describe` named after the **function/method** under test.
3. Factory tests: instance methods; `describe` by method name.
4. No production exports created only for tests (see Block C).

### ESLint / disables (intent — analyze, don’t run ESLint)

1. File-level `eslint-disable` only at **top** of file (before imports).
2. **One rule per** `eslint-disable` line; no `-- reason` descriptions.
3. Prefer file-top disable over scattered `eslint-disable-next-line` for whole-file concerns.
4. Respect functional style intent: avoid needless `let`, mutation, and expression statements outside allowed file kinds
   (`*.state.*`, hooks, tests, etc.).
5. Naming-convention intent matches Block G naming items.
6. `consistent-type-definitions`: types only.
7. Strict boolean expressions — don’t use truthiness on non-booleans casually; be explicit.
8. No `Readonly<>` utility type (project restricts it).

### Markdown / docs touched by the branch

1. Docs in **English** (unless user asked otherwise).
2. One emoji at start of H1–H3 when matching project doc style.

### General quality bar

1. Every changed line should serve the feature; no drive-by refactors in the proposal unless they fix a finding.
2. Prefer existing patterns in neighboring files of the same package.
3. Prefer deleting code over adding configuration knobs.
4. Error handling only for realistic failures — no defensive noise for impossible states.
5. Keep public APIs minimal; don’t export “just in case”.
6. After proposed fixes, touched code should still read as one consistent style with the package.

---

## ⚠️ Edge cases

- **Merge commits / messy history** — still review the aggregate `<base>...HEAD` diff, not commit-by-commit unless a
  regression is unclear.
- **Generated files** — skip noise; if the branch only updates generated output, say so in Summary and focus on sources.
- **Mixed feature + drive-by** — separate findings: required correctness vs optional cleanup.
- **Unsure base branch** — ask the user whether base is `main` or something else before reviewing.
- **User asked to run tests/lint** — that is outside this command; suggest `!check.bat` / MCP workflows separately.

---

## ✅ Done criteria

- All changed files in scope reviewed against Blocks A–G.
- Report includes Summary + Findings + Ask.
- No linters/tests were executed as part of this command.
- No code edits until the user confirms.
