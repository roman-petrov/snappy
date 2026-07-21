# 🐛 Regressions

- **id:** `regressions`
- **emoji:** 🐛
- **severity:** `must-fix`

## 🎯 Scope

**Behavior changed vs the previous version** (diff / `git show <parent>`). Leave pure “new code is wrong by itself”
bugs to `correctness`.

Not: style, dead code, comments, convention atoms.

## 🔍 Look for

- Removed/narrowed behavior, changed defaults, missing branches, broken invariants
- API shape changes without call-site updates
- Async/abort/cleanup regressions, condition flips, off-by-one, lost error handling, broken UI flows

## 🔎 Detect

Read diff; follow call sites of changed exports; `git show <parent>:path` when unclear (`<base>` or `HEAD~1`).

## 🔧 Fix

Intended change → update all call sites; else restore previous behavior. Say which; keep diff minimal.

## 📐 Conventions

`none`
