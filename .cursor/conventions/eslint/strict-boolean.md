# 📘 Strict boolean expressions

- **id:** `eslint/strict-boolean`
- **emoji:** 📘
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Don't use truthiness on non-booleans casually; be explicit.

## 🔍 Detect

Find `if (maybeString)` / similar where a boolean check is clearer.

## 🔧 Fix

Use explicit comparisons (`=== undefined`, `!== ""`, etc.)

## 📝 Examples

### ❌ Bad

`if (name) { … }`

### ✅ Good

`if (name !== "") { … }`
