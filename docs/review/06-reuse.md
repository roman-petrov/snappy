# 🔧 Reuse

- **id:** `reuse`
- **emoji:** 🔧
- **severity:** `optional-cleanup`

## 🎯 Scope

New helpers that should call an existing project API. Not: general simplify, comments, dead code, regressions,
correctness, stack conventions.

## 🔍 Look for

New helpers/wrappers duplicating existing utilities or reimplemented logic.

## 🔎 Detect

Via do MCP `conventions`: `get` ids `[programming/reuse-existing]` only; search for existing APIs; Detect + `applies`.

## 🔧 Fix

Reuse existing API; delete/narrow the new helper. Surgical.

## 📐 Conventions

Atom `programming/reuse-existing`. Atom `emoji` or 🔧.
