# 📐 Pure functions

- **id:** `programming/pure-functions`
- **emoji:** 📐
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

The main unit is the function. Prefer pure functions; extract them and cover with tests. Side effects at clear
boundaries.

## 🔍 Detect

Look for mixed pure logic and side effects in one unit without a clear boundary.

## 🔧 Fix

Extract pure parts; keep side effects at edges

## 📝 Examples

### ❌ Bad

```ts
const bump = () => {
  total += 1;
};
```

### ✅ Good

```ts
const next = (total: number) => total + 1;
```
