# 🗑️ Dead / unused

- **id:** `dead-unused`
- **emoji:** 🗑️
- **severity:** `optional-cleanup`

## 🎯 Scope

Unused/dead code from the scoped changes. Not: regressions, correctness, comments, reuse, simplify, non-`unused`
convention atoms.

## 🔍 Look for

- Unused exports/functions/vars/types/imports; unreachable branches/files
- Test-only production seams (`unused/test-only-production`, `unused/test-public-api`)

## 🔎 Detect

Via do MCP `conventions`: `search` `group: unused`, then `get` those ids. Detect + `applies` on scoped files; verify
call sites.

## 🔧 Fix

Delete dead code. For test-only seams: remove production export; test via public API.

## 📐 Conventions

Group `unused/`. Atom findings → atom `emoji`; else 🗑️.
