# 📐 Stack conventions

- **id:** `conventions`
- **emoji:** 📐
- **severity:** `optional-cleanup`

## 🎯 Scope

Stack atoms on touched files. Not: unused/dead, comments, reuse, other `programming/`, or `agent/` (parent uses `agent/`
when planning).

## 🔍 Look for

Violations of applicable atoms in the groups below, introduced or left by the scoped changes.

## 🔎 Detect

Read `docs/conventions/README.md`; load in order: `typescript`, `react`, `css`, `testing`, `eslint`, `markdown`. Enforce
via Detect + `applies` (grep/read; no memory).

## 🔧 Fix

Per atom Fix; smallest change; do not break other applicable atoms.

## 📐 Conventions

Groups above. Findings use each atom’s `emoji`.
