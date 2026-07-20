# 📘 Functional style intent

- **id:** `eslint/functional-intent`
- **emoji:** 📘
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Avoid needless `let`, mutation, and expression statements outside allowed file kinds (`*.state.*`, hooks, tests, etc.).

## 🔍 Detect

Find needless mutation/`let` in pure modules.

## 🔧 Fix

Prefer `const` and immutable updates; keep mutation only where allowed

## 📝 Examples

### ❌ Bad

```ts
let total = 0;
for (const n of values) total += n;
```

### ✅ Good

```ts
const total = values.reduce((sum, n) => sum + n, 0);
```
