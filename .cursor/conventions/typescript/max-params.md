# 🔧 Max parameters

- **id:** `typescript/max-params`
- **emoji:** 🔧
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Avoid long positional parameter lists. Practical max is 5 (project ESLint). Prefer an options object when many inputs
are needed.

## 🔍 Detect

Count positional params on functions.

## 🔧 Fix

Collapse into an options object or split the function

## 📝 Examples

### ❌ Bad

`run(a, b, c, d, e, f)`

### ✅ Good

`run(options)`
