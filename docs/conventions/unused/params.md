# 🗑️ Unused function parameters

- **id:** `unused/params`
- **emoji:** 🗑️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Parameters declared but never used in the body must be removed (update call sites) or prefixed with `_` if the API
requires the shape.

## 🔍 Detect

For each parameter, check body usage.

## 🔧 Fix

Remove or prefix with `_`

## 📝 Examples

### ❌ Bad

`const run = (value: number, offset: number) => value * 2;`

### ✅ Good

`const run = (value: number) => value * 2;`
