# 📘 No Readonly<>

- **id:** `eslint/no-readonly`
- **emoji:** 📘
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Do not use the `Readonly<>` utility type (project restricts it).

## 🔍 Detect

Grep for `Readonly<`.

## 🔧 Fix

Remove `Readonly<>`; use mutable types / conventions the project allows

## 📝 Examples

### ❌ Bad

`type Item = Readonly<{ id: string }>;`

### ✅ Good

`type Item = { id: string };`
