# ✂️ Simplify

- **id:** `simplify`
- **emoji:** ✂️
- **severity:** `optional-cleanup`

## 🎯 Scope

Redundant control flow, wrappers, intermediates, over-abstraction. Not: comments, reuse, dead code, regressions,
correctness. Do not report stack-convention violations here (conflict gate only).

## 🔍 Look for

- Wrappers / one-offs to inline; unnecessary layers
- Note ~lines removed when deleting

## 🔎 Detect

1. Read `docs/conventions/README.md` (load protocol + `applies`).
2. Glob/Read all `programming/` atoms; **skip** `comments` and `reuse-existing`; enforce the rest via Detect.
3. Conflict gate (load, do **not** report): `typescript`, `react`, `css`, `testing`, `eslint`, `markdown`.
4. Diff + surroundings. Before reporting, verify the proposed fix against loaded atoms + gate — on conflict drop
   (`Notes`: `dropped: convention conflict`).

## 🔧 Fix

Delete / inline / narrow. Never report a convention-conflicting simplification.

## 📐 Conventions

Atom findings → atom `emoji`; else ✂️.
