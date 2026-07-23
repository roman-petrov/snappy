# 💬 Comments

- **id:** `comments`
- **emoji:** 💬
- **severity:** `optional-cleanup`

## 🎯 Scope

Comments in the scoped diff only.

## 🔍 Look for

Obvious, non-English, obsolete, AI-narrative comments. Keep linter/cspell directives and non-obvious intent.

## 🔎 Detect

Via do MCP `conventions`: `search` `group: programming` `query: comments`, then `get` those ids only. Detect on scoped
comments (`applies`).

## 🔧 Fix

Per atom: remove/rewrite; keep justified intent + tool directives.

## 📐 Conventions

Atoms `programming/comments`, `programming/comments-english`, `programming/comments-no-noise`. Atom `emoji` or 💬.
