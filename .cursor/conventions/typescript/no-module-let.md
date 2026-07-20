# 📦 No module-level let

- **id:** `typescript/no-module-let`
- **emoji:** 📦
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Don't use `let` at module level (only `const` or functions). `let` inside factory closures is allowed when needed.

## 🔍 Detect

Grep top-level `let`.

## 🔧 Fix

Use `const` or move into a function/factory

## 📝 Examples

### ❌ Bad

`let count = 0;` at module scope

### ✅ Good

`let` only inside a factory/closure when needed
