# 🔧 Boolean defaults

- **id:** `programming/boolean-defaults`
- **emoji:** 🔧
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Boolean parameters and properties are optional with default `false`. Passing `true` activates something off by default.

## 🔍 Detect

Find required booleans or defaults of `true`.

## 🔧 Fix

Make optional with default `false`; update call sites.

## 📝 Examples

### ❌ Bad

```ts
const run = (verbose: boolean) => …
```

### ✅ Good

```ts
const run = (verbose = false) => …
```
