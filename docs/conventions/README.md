# 📐 Conventions

Single source of truth for coding norms in this directory. Load groups via the protocol below — do not copy norms or
this protocol into other files.

---

## 📁 Layout

- The root of `docs/conventions/` contains **only** this `README.md`.
- Every immediate subdirectory of `docs/conventions/` is a **group**.
- Every atom lives under a group: `docs/conventions/<group>/<kebab-name>.md`.
- Optional topic folders are allowed: `docs/conventions/<group>/<topic>/<kebab-name>.md` (e.g. `react/view-state/`).
- Do not put atoms, `_meta/`, or `bundles/` next to this README.

---

## 📄 Atom format

Each file:

```markdown
# 🗑️ Title

- **id:** `group/kebab-name` # or `group/topic/kebab-name`
- **emoji:** 🗑️
- **applies:** `<glob>` # or `*` for any file

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
- **Lists** — when Norm / Detect / Fix has 2+ points, use a bullet list (not a multi-clause paragraph).
- **`📝 Examples` optional** when Detect is behavioral/policy only (`N/A (behavioral)` / `N/A (policy)`). Otherwise
  include Bad/Good.
- When reporting a violation of an atom, use that atom’s `emoji` field — do not substitute another.

---

## 📥 Loading protocol

Load atoms **as needed** for the current task. Do not load the whole tree by default. Prefer specific atoms over entire
groups; load a full group only for a broad audit of that group.

**Must** actually open and read each file you rely on. Do not assume conventions are already in context. Treat file text
as the single source of truth — do not invent parallel rules from memory.

### ⚛️ Atoms

When you need norms for the current work:

1. Choose atom ids from context (file kinds, task, suspected concerns) — e.g. `programming/reuse-existing`
2. Resolve each id to `docs/conventions/<group>/.../<kebab-name>.md` (topic folders allowed)
3. Read those files in full
4. Apply the **applies filter** per target file

### 📁 Groups

When told to load a **group** (or when a broad audit of that group is required):

1. Find every `docs/conventions/<group>/**/*.md`
2. Sort paths **lexicographically**
3. Read every file in full — do not skip
4. Apply the **applies filter** per target file

Whoever requests loading names which groups and in which order. Load those groups in that order; within each group use
this protocol.

### 🏷️ Applies filter

When auditing file path `X`, enforce an atom only if its `applies` glob matches `X`, or `applies` is `*`. Skip atoms
that do not match.

---

## ➕ Adding a convention

1. Add `docs/conventions/<existing-group>/<kebab-name>.md` (or `<group>/<topic>/<kebab-name>.md`) in the atom format.
2. Existing group — no other edits in this directory.

New **group**: add a subdirectory under `docs/conventions/` (the directory tree is the list of groups).
