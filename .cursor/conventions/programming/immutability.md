# 📐 Prefer immutability

- **id:** `programming/immutability`
- **emoji:** 📐
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Do not use mutation; use immutable data when possible.

## 🔍 Detect

Look for in-place array/object mutation when a copy/new value would work.

## 🔧 Fix

Replace mutation with immutable updates

## 📝 Examples

### ❌ Bad

`items.push(item);`

### ✅ Good

`const next = [...items, item];`
