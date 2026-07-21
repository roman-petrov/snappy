# ✅ Correctness

- **id:** `correctness`
- **emoji:** ✅
- **severity:** `must-fix`

## 🎯 Scope

**Logic that cannot work as written**, judged on the new code itself (no old-vs-new needed). Leave pure “used to work
differently” bugs to `regressions`.

Not: dead code, comments, reuse, simplify, convention atoms.

## 🔍 Look for

- Impossible / wrong runtime logic or types; bad derived data
- Wrong handlers/props; store/subscription leaks; non-exhaustive unions; bad `undefined` handling; SSR/client misuse

## 🔎 Detect

Trace data flow; check symmetric ops (add/remove, open/close); match returned objects to consumers.

## 🔧 Fix

Correct the logic; smallest change. Reason in the finding — do not run tests/linters to “prove” it.

## 📐 Conventions

`none`
