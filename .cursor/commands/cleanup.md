# 🧹 Cleanup: Unused Code and Convention Violations

<!-- cspell:word inlines -->

**Goal:** Find unused code and convention violations, produce a report and fix all violations.

**How to run (summary):** Load rules → build file list → scan files in order → **stop on first file with any violation**
→ for that file only, run all Block A then all Block B checks using **grep/search (do not rely on memory)** → build
linear report (emoji + where + what + fix) → output and ask; **do not apply fixes until user confirms.**

---

## 📋 Algorithm (strict step-by-step)

### 1️⃣ Step 1 — Load rules

- Read all files in `.cursor/rules/` (`.mdc`, `.md`).
- For each rule, determine: `globs` (if any) and `alwaysApply`.
- Rules are the single source of truth for the cleanup.

---

### 2️⃣ Step 2 — Analyze project patterns

- Determine which patterns the project uses: barrel files, View/State in React, pure vs factory modules, test structure,
  etc.
- Use this to make checks relevant (e.g. only check View/State where the pattern exists).

---

### 3️⃣ Step 3 — Build file list

- If the user specified a **file or folder** together with the command — run the audit for that path only (that file, or
  all files in that folder).
- If no file is specified — **build the list via tools:** use glob/search to get all source files (exclude
  `node_modules`, build output, generated files). Do not rely on "currently open" or "recent" files; use a deterministic
  order (e.g. alphabetical by path), then scan in order until the first file with violations is found.

---

### 4️⃣ Step 4 — Scan with stop-on-first-file

- For **each** file in the list (in order):
  1. Run violation checks in **priority order**: first all checks from Block A (top to bottom), then all checks from
     Block B (top to bottom).
  2. **Use tools for detection:** for each check type use `grep` / codebase search (or read file) as described in "How
     to detect"; do not rely on memory or prior context.
  3. If **at least one** violation is found in this file:
     - **Stop** scanning other files.
     - Continue checking **only this file** for **all** violation types (unused code and convention violations).
     - Collect every violation in this file into the report.
  4. If no violation is found — proceed to the next file.

Do **not** continue to the next file after finding the first file with violations; focus only on that one file and
complete the full list of its violations.

---

### 5️⃣ Step 5 — Build report and fix plan

- **Load the file:** read the full contents of the file that has violations (so fixes are consistent with current code).
- Compose a **user-facing report** as a single linear list of violations. Do **not** list or enumerate the rules from
  `.cursor/rules/` in the report.
- For **each** violation include:
  - **Emoji** — one emoji per violation; use only the emoji from the list in Report format (🗑️ 📐 📝 🔧 📦 ⚛️ 🧪 🎨 💬).
  - **Where** — file path and location (e.g. line, symbol name).
  - **What is violated** — short description of the problem (no rule name).
  - **What will be fixed** — short, actionable fix (what will be done).
- Structure of the report: **linear list of violations** (each item: emoji + where + what violated + what will be
  fixed).

---

### 6️⃣ Step 6 — Output and ask

- Emit the full report in the chat (linear list only; each item: emoji + where + what violated + what will be fixed).
- Ask the user whether to apply the fixes ("Apply these fixes?").
- Do **not** change the codebase until the user confirms.

---

## 📄 Report format (mandatory)

**Present the report as a single linear list of violations. Use lists only (no tables). Do not list or cite rule names.
Each list item MUST start with one of the 9 emoji below.**

**Emoji** — use **only** these emoji from the list (one per violation, by category):

- 🗑️ — unused code (unused class, variable, import, parameter, type, etc.)
- 📐 — convention / style (minimal params, destructure, single source of truth, DRY)
- 📝 — naming (simple names, no redundant context, no get/make/utils)
- 🔧 — parameters / signature (boolean default, destructure params)
- 📦 — types (type vs interface, inference, union members)
- ⚛️ — React (component, props, hooks, View/State, CSS modules)
- 🧪 — tests (describe name, destructure module, call without prefix)
- 🎨 — CSS/SCSS (unused/duplicate/redundant styles)
- 💬 — comments (obvious or non-English)

**Linear list of violations** — one list item per violation. Each item must include:

- **Emoji** — one from the list above
- **Where** — file and location (e.g. `path/to/file.ts:42`, or `path/to/file.ts` → function/selector name)
- **What is violated** — brief description of the problem (without naming the rule)
- **What will be fixed** — one short actionable phrase (what will be done)

At the end of the report, offer the user to fix all problems ("Apply these fixes?").

**Example of one list item:**  
`🗑️`**`src/Button.module.scss:12`** — Unused class `.oldButton` never referenced. → Remove selector and its rule block.

---

## 🗑️ Block A — Unused code

Use lists only. For each violation type use this structure: **Name** as list item, then nested sub-items for **What to
look for**, **How to detect**, **How to fix**.

- **CSS/SCSS — unused classes**
  - What to look for: Class selectors (`.className`) or `%placeholder` in SCSS never used in TS/TSX/HTML.
  - How to detect: Extract all class/placeholder names from SCSS; grep each in codebase.
  - How to fix: Remove the selector/placeholder and any rule block that only contains it.
- **CSS/SCSS — unused variables**
  - What to look for: `$var` or `--css-var` never referenced.
  - How to detect: Extract variables from SCSS; grep for `$var` and `var(--css-var)` (or equivalent) in codebase.
  - How to fix: Remove the variable declaration.
- **CSS/SCSS — unused mixins**
  - What to look for: `@mixin name` never `@include name`.
  - How to detect: Extract mixin names; grep for `@include name`.
  - How to fix: Remove the mixin definition.
- **CSS/SCSS — unused files**
  - What to look for: SCSS file never imported.
  - How to detect: Grep for imports of the file path.
  - How to fix: Delete the file.
- **CSS/SCSS — unused `@use` namespaces**
  - What to look for: Namespace from `@use` is declared but never referenced as `namespace.token()`, `namespace.$var`,
    `namespace.mixin()`, etc.
  - How to detect: For each SCSS file, list all `@use` imports (including `as alias`), then grep within that file for
    `alias.` usage. Ignore `as *` (no namespace).
  - How to fix: Remove unused `@use` lines.
- **CSS/SCSS — duplicate properties**
  - What to look for: Same property declared twice in one rule block; second wins, first is dead.
  - How to detect: In each rule block, look for repeated property names; or use Stylelint
    `declaration-block-no-duplicate-properties`.
  - How to fix: Remove the first declaration.
- **CSS/SCSS — redundant longhand**
  - What to look for: Longhand (e.g. `padding-top`) when shorthand (e.g. `padding`) already sets the same value.
  - How to detect: Stylelint `declaration-block-no-redundant-longhand-properties` or manual check.
  - How to fix: Remove the redundant longhand.
- **CSS/SCSS — inherited override**
  - What to look for: Child rule sets same inherited property as parent (e.g. `color`, `font-*`, `line-height`) with
    same value.
  - How to detect: Compare nested rules to parent; check inherited properties.
  - How to fix: Remove the redundant child declaration.
- **CSS/SCSS — overridden by cascade**
  - What to look for: Earlier rule's property overridden by later rule or higher specificity.
  - How to detect: Trace cascade and specificity for each selector.
  - How to fix: Remove the earlier declaration that never applies.
- **CSS/SCSS — default/initial value**
  - What to look for: Property set to `initial`, `unset`, or UA default with no override needed.
  - How to detect: Identify properties matching default or `initial`.
  - How to fix: Remove the declaration if it has no effect.
- **Object export — unused property**
  - What to look for: `export const X = { a, b, c }` and property (e.g. `b`) never referenced as `X.b` or bare `b` if
    re-exported.
  - How to detect: For each exported object, grep for `X.a`, `X.b`, `X.c` (and bare names).
  - How to fix: Remove the unused property from the object.
- **Unused types — export**
  - What to look for: Exported `type` or `interface` never imported elsewhere.
  - How to detect: Grep for imports of the type name.
  - How to fix: Remove the export or the type if unused everywhere.
- **Unused types — union member**
  - What to look for: Union member (e.g. `'b'` in `type X = 'a' | 'b' | 'c'`) never used as value.
  - How to detect: Grep for each union member as value.
  - How to fix: Remove the unused member from the union.
- **Commented-out code**
  - What to look for: Blocks of `//` or `/* ... */` containing code-like content (obsolete).
  - How to detect: Search for comment blocks with code (identifiers, brackets, etc.).
  - How to fix: Delete the commented block.
- **Unreachable code**
  - What to look for: Code after `return`/`throw` or in branches that never run.
  - How to detect: Inspect each function for flow; find code after final return/throw or in impossible branches.
  - How to fix: Remove the dead block.
- **Unused function parameters**
  - What to look for: Parameter declared but never used in function body.
  - How to detect: For each parameter, check if it appears in the body.
  - How to fix: Remove the parameter (and update call sites) or prefix with `_` if API requires the shape.

in Block A and Block B for the target file; do not skip a check because the file "looks clean."

---

## 📐 Block B — Convention violations

Use lists only. For each item use this structure: **Name** as list item, then nested sub-items for **Rule source**,
**What to look for**, **How to detect**, **How to fix**.

- **Pure module — object of functions**
  - Rule source: typescript.
  - What to look for: Individual `export function` or `export const fn` instead of single namespace.
  - How to detect: Find exports; expect `export const X = { fn1, fn2 }`.
  - How to fix: Group into one `export const ModuleName = { fn1, fn2 }`; remove individual exports (except allowed
    exceptions).
- **Factory — local consts and ReturnType**
  - Rule source: typescript.
  - What to look for: Factory that inlines arrow functions in return; or missing API type.
  - How to detect: Check factory: functions should be local `const` then returned; type as `ReturnType<typeof Factory>`.
  - How to fix: Extract functions as local `const`; add `export type X = ReturnType<typeof X>`.
- **Reuse existing functions**
  - Rule source: programming.
  - What to look for: New helper that might duplicate existing project logic.
  - How to detect: Before adding a helper, search codebase for same or similar function.
  - How to fix: Use existing function or deduplicate.
- **One-off variable/function**
  - What to look for: Variable or function used only once in the file and not reused elsewhere.
  - How to detect: Count references to the variable/function.
  - How to fix: Inline the single use and remove the variable/function declaration.
- **Minimal parameters**
  - Rule source: programming.
  - What to look for: Function receives an object but uses only 1 field; or uses 2+ fields but could receive a smaller
    type.
  - How to detect: Find functions with object params; check body for property access.
  - How to fix: 1 field: pass single scalar. 2+ fields: define small type with only those fields; change signature and
    call sites.
- **Single source of truth**
  - Rule source: programming.
  - What to look for: Same data in multiple variables/configs/structures.
  - How to detect: Search for duplicated values or parallel lists.
  - How to fix: Keep one canonical source; derive the rest.
- **Don't duplicate code**
  - Rule source: programming.
  - What to look for: Repeated logic in several places.
  - How to detect: Find similar code blocks across files.
  - How to fix: Extract function or shared constant.
- **Simple names**
  - Rule source: programming.
  - What to look for: Function names with get/create/make/calculate/compute; names with
    utils/utilities/helper/manager/factory/wrapper.
  - How to detect: Grep for these words in identifiers.
  - How to fix: Rename: drop auxiliary verb in functions; replace generic suffix with concrete name.
- **No redundant context in names**
  - Rule source: programming.
  - What to look for: Child identifier repeats parent context (e.g. `messageText` inside `sendMessage`).
  - How to detect: Read scope; check if name echoes parent/context.
  - How to fix: Shorten to context-free name (e.g. `text`, `body`).
- **Comments**
  - Rule source: programming.
  - What to look for: Obvious comments; non-English comments.
  - How to detect: Read comments; check language.
  - How to fix: Remove obvious comments; translate or remove non-English.
- **Boolean parameters**
  - Rule source: programming.
  - What to look for: Required boolean or boolean with default `true`.
  - How to detect: Check parameter defaults and call sites.
  - How to fix: Make boolean optional with default `false`.
- **Type not interface**
  - Rule source: typescript (globs: `**/*.{ts,tsx}`).
  - What to look for: Use of `interface`.
  - How to detect: Grep for `interface`.
  - How to fix: Replace with `type`.
- **Infer types from values**
  - Rule source: typescript.
  - What to look for: Explicit type where inference is possible (e.g. literal array, return type).
  - How to detect: Check annotations on const/return.
  - How to fix: Remove annotation or use `as const` / `typeof` where appropriate.
- **Destructure parameters**
  - Rule source: typescript.
  - What to look for: `(props: Props)` with `props.a`, `props.b` in body.
  - How to detect: Find params typed as object; check body for `param.` access.
  - How to fix: Change to `({ a, b }: Props)` and use `a`, `b`.
  - **Exception:** Do not report when the whole object is passed through to another call (e.g.
    `(props) => <Child {...props} />` or `fn(opts)` where the function only forwards `opts`).
- **Destructure assignments**
  - Rule source: typescript.
  - What to look for: `const x = obj` then `x.a`, `x.b`.
  - How to detect: Find object assignments followed by property access.
  - How to fix: Use `const { a, b } = obj`.
- **Ternary over multiple if-return**
  - Rule source: typescript.
  - What to look for: Several `if` branches each returning a value.
  - How to detect: Find functions with multiple `if … return` for same outcome type.
  - How to fix: Replace with single return and ternary (or nested ternary).
  - **Exception:** Do not report if the only way to convert would require an **IIFE** (e.g.
    `return a ? x : (async () => { … })()` or `return a ? (() => { … })() : b`). Do not introduce IIFEs for this rule;
    keep `if`/`return` when the branch has async work or multiple statements.
- **No let at module level**
  - Rule source: typescript.
  - What to look for: `let` at top level of module.
  - How to detect: Grep for top-level `let`.
  - How to fix: Use `const` or move into function/factory.
- **One component per file**
  - Rule source: react (globs: `**/*.tsx`).
  - What to look for: Multiple component definitions in one file.
  - How to detect: Count component definitions per file.
  - How to fix: Split into one file per component.
- **Export props type**
  - Rule source: react.
  - What to look for: Component without exported props type or wrong name.
  - How to detect: Check for `<Name>Props` exported.
  - How to fix: Export type named `<ComponentName>Props`.
- **Hooks in hooks directory**
  - Rule source: react.
  - What to look for: Hook file outside a `hooks` directory.
  - How to detect: Find files exporting hooks; check path contains `hooks`.
  - How to fix: Move hook module into `hooks/`.
- **View/State — entry no layout**
  - Rule source: react.
  - What to look for: Entry file contains layout JSX or logic.
  - How to detect: Entry should only compose state + view.
  - How to fix: Move layout and logic to view/state.
- **View/State — view no hooks/logic**
  - Rule source: react.
  - What to look for: View file uses hooks, conditionals, or computed values.
  - How to detect: View should only receive props and render JSX.
  - How to fix: Move hooks and logic to state hook.
- **View/State — state no JSX**
  - Rule source: react.
  - What to look for: State file contains JSX.
  - How to detect: State hook should only return data.
  - How to fix: Move all markup to view file.
- **CSS modules only in view**
  - Rule source: react.
  - What to look for: State or entry imports CSS module.
  - How to detect: Grep for `.module.css`/`.module.scss` imports.
  - How to fix: Import styles only in view file.
- **View props type**
  - Rule source: react.
  - What to look for: View props type hand-written instead of derived.
  - How to detect: Check view props type.
  - How to fix: Use `ReturnType<typeof useComponentState>` for view props.
- **Destructure module under test**
  - Rule source: testing (globs: `**/*.test.{ts,tsx}`).
  - What to look for: Tests call `Module.fn()` instead of destructured `fn()`.
  - How to detect: Check test file: import then destructure, call without prefix.
  - How to fix: Destructure at top; use `fn()` in tests.
- **describe by function name**
  - Rule source: testing.
  - What to look for: `describe` not named after the function under test.
  - How to detect: Check first argument of top-level `describe`.
  - How to fix: Use function name as `describe` argument.
- **Call without module prefix**
  - Rule source: testing.
  - What to look for: `Module.fn(x)` inside tests.
  - How to detect: Grep for `Module.` in test body.
  - How to fix: Call `fn(x)` after destructuring.
- **Barrel files and import from barrel**
  - Rule source: typescript.
  - What to look for: Import from concrete file (e.g. `from "./Button"`) instead of barrel.
  - How to detect: Check imports; expect `from "./components"` or package.
  - How to fix: Create/use barrel; change imports to barrel path.
- **ESLint disables at top**
  - Rule source: eslint (globs: `**/*.{js,ts,mjs,cjs}`).
  - What to look for: `eslint-disable` in the middle of file or multiple rules in one comment.
  - How to detect: Check position and format of disables.
  - How to fix: Move to top of file; one rule per line; no descriptions.
