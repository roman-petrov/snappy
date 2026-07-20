# 📦 undefined not null

- **id:** `typescript/undefined-not-null`
- **emoji:** 📦
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Don't use `null`; use `undefined` for absent values. Prefer `T | undefined` or optional fields.

## 🔍 Detect

Grep for `null`.

## 🔧 Fix

Replace with `undefined` / optional

## 📝 Examples

### ❌ Bad

`type User = { name: string | null };`

### ✅ Good

`type User = { name?: string };`
