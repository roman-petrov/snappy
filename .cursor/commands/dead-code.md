# 🧹 Dead Code Hunt

**Goal:** find and **remove** unused or unnecessary code. **Do NOT use Knip** — this command targets patterns Knip does
not handle.

---

## ⛔ Do not use Knip

Knip is already run in CI. This command covers gaps Knip misses.

---

## 📋 Patterns to search and remove

### 1️⃣ CSS/SCSS — unused and ineffective styles

#### A. Unused (never referenced)

- **Classes** — grep each `.className` / `%placeholder` in SCSS; if never referenced in TS/TSX/HTML, remove.
- **Variables** — `$var`, `--css-var`; if never used, remove.
- **Mixins** — `@mixin name`; if never `@include`, remove.
- **Files** — SCSS files never imported; remove file.

**Method:** Extract all class names, variables, mixins from SCSS → search codebase for each → remove unused.

#### B. Redundant / no-effect (duplicate or overridden)

Styles that duplicate already applied styles or have no visible effect in the cascade:

1. **Duplicate properties in same rule block** — same property declared twice; the second wins, the first is dead.
   - Grep: `property:\s*value` in a block, look for repeated property names.
   - Stylelint: `declaration-block-no-duplicate-properties`.

2. **Redundant longhand** — shorthand already covers the value (e.g. `padding` + `padding-top` with same effect).
   - Stylelint: `declaration-block-no-redundant-longhand-properties`.

3. **Inherited property repeated on child** — parent `.foo { color: #333 }`, child `.foo .bar { color: #333 }`; the
   child rule is redundant (inherited properties flow down). Applies to `color`, `font-*`, `line-height`, etc.
   - Method: For nested rules, check if child property is inherited and matches parent; remove if identical.

4. **Overridden by cascade** — a later rule or higher-specificity selector sets the same property; the earlier one never
   applies.
   - Method: Trace cascade for each selector; if another rule with same or higher specificity sets the property later,
     the earlier declaration is dead.

5. **Default/initial values** — setting `initial`, `unset`, or the property’s default when no other rule overrides it
   (e.g. `display: block` on a block element).
   - Method: Identify properties that match UA default or `initial`; remove if they add no effect.

**Method:** For each SCSS file, inspect rule blocks for duplicate properties; for nested rules, compare with parent and
sibling rules; consider cascade order and specificity. Prefer Stylelint rules where applicable.

---

### 2️⃣ Object export properties — unused members

```ts
export const MyModule = { usedConst, unusedConst };
```

If `unusedConst` (or `MyModule.unusedConst`) is never referenced anywhere — remove it from the object.

**Method:** For each `export const X = { a, b, c }`, search for `X.a`, `X.b`, `X.c` (and bare `a`, `b`, `c` if
re-exported). Remove properties with zero references.

---

### 3️⃣ Unused types

- **Exported type/interface** never imported — remove export.
- **Union members** — `type X = 'a' | 'b' | 'c'`; if `'b'` is never used as value, remove it.

**Method:** For each exported type, search for imports/usages. For union types, grep each member; remove unused.

---

### 4️⃣ Commented-out code

Blocks of commented code (e.g. `// oldFn()`, `/* ... */`) that are clearly obsolete — remove.

**Method:** Search for `//` and `/*` blocks that contain code-like content. Remove if dead.

---

### 5️⃣ Unreachable code

Code after `return`, `throw`, or in branches that never run — remove.

**Method:** Inspect functions for code after final return/throw; remove dead blocks.

---

### 6️⃣ Unused function parameters

Parameters declared but never used — remove or prefix with `_` if required by API.

**Method:** For each function param, check if referenced in body. Remove if unused (respect API contracts).

---

## 📐 Algorithm

1. **Scope** — user-specified path or full project (exclude `node_modules`, build output, generated files).
2. **For each pattern** — run search, collect findings.
3. **Remove** — delete all identified dead code. Do not leave it for later.
4. **Report** — briefly list what was removed (file, item).

---

## ✅ Checklist

- [ ] Knip not used
- [ ] CSS/SCSS: classes, variables, mixins checked (unused)
- [ ] CSS/SCSS: duplicate properties, redundant longhand, inherited overrides, cascade-dead rules checked (ineffective)
- [ ] Object exports: each property verified
- [ ] Types: exports and union members verified
- [ ] Commented-out code removed
- [ ] Unreachable code removed
- [ ] Unused parameters removed
- [ ] All found dead code **deleted**
