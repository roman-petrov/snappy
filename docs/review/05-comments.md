# 💬 Comments

- **id:** `comments`
- **emoji:** 💬
- **severity:** `optional-cleanup`

## 🎯 Scope

Comments in the scoped diff only.

## 🔍 Look for

Obvious, non-English, obsolete, AI-narrative comments. Keep linter/cspell directives and non-obvious intent.

## 🔎 Detect

Read `docs/conventions/README.md`; load atoms matching `programming/comments*` only; Detect on scoped comments
(`applies`).

## 🔧 Fix

Per atom: remove/rewrite; keep justified intent + tool directives.

## 📐 Conventions

- `docs/conventions/programming/comments.md`
- `docs/conventions/programming/comments-english.md`
- `docs/conventions/programming/comments-no-noise.md`

Atom `emoji` or 💬.
