# 🗑️ Unused object export property

- **id:** `unused/object-export-property`
- **emoji:** 🗑️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Exported object properties never referenced (`X.b` or bare re-export) must be removed.

## 🔍 Detect

For each exported object property, grep references.

## 🔧 Fix

Remove the unused property

## 📝 Examples

### ❌ Bad

`export const Math = { add, unused };`

### ✅ Good

`export const Math = { add };`
