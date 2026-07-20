# 📐 Conventions

Single source of truth for coding norms in this directory. Callers only activate loading — they must not copy norms or
this protocol.

---

## 📁 Layout

- The root of `conventions/` contains **only** this `README.md`.
- Every atom lives in a group subdirectory: `conventions/<group>/<kebab-name>.md`.
- Do not put atoms, `_meta/`, or `bundles/` next to this README.

Groups: `agent`, `programming`, `typescript`, `react`, `css`, `testing`, `eslint`, `markdown`, `unused`.

---

## 📄 Atom format

Each file:

```markdown
# 🗑️ Title

- **id:** `group/kebab-name`
- **emoji:** 🗑️
- **applies:** `**/*.{ts,tsx}` # or `*` for any file

## 📐 Norm

One clear rule.

## 🔍 Detect

How to find violations (grep / read). Do not rely on memory.

## 🔧 Fix

What to change.

## 📝 Examples

### ❌ Bad

### ✅ Good
```

- One concern per file; aim for ~15–60 lines of body.
- Language: **English**.
- **H1** — atom category emoji (same value as the `emoji` field).
- **Structure headings** — fixed in every atom (do not invent variants): `📐 Norm`, `🔍 Detect`, `🔧 Fix`,
  `📝 Examples`, `❌ Bad`, `✅ Good`.
- **`📝 Examples` optional** when Detect is behavioral/policy only (`N/A (behavioral)` / `N/A (policy)`). Otherwise
  include Bad/Good.
- `emoji` is required when reporting a violation of this atom (`/cleanup`, `/review` convention findings, and similar).
  Do not substitute a different emoji from a command’s fixed list.

---

## 📥 Loading protocol

When told to load a **group**:

1. **Glob** `conventions/<group>/**/*.md`
2. Sort paths **lexicographically**
3. **Read** every file in full — do not skip
4. Treat file text as the single source of truth — do not invent parallel rules from memory

**Must** use the Read tool (and Glob). Do not assume conventions are already in context.

The **caller** names which groups to load and in which order. Load those groups in that order; within each group use
this protocol. Apply the **applies filter** per target file.

### 🏷️ Applies filter

When auditing file path `X`, enforce an atom only if its `applies` glob matches `X`, or `applies` is `*`.  
Skip atoms that do not match (e.g. do not apply TypeScript norms to `.scss`).

---

## ➕ Adding a convention

1. Add `conventions/<existing-group>/<kebab-name>.md` in the atom format.
2. Existing group — no other edits in this directory.

New **group**: add a subdirectory and list it under Layout above.
