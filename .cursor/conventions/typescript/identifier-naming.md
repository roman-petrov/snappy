# 📝 Identifier naming

- **id:** `typescript/identifier-naming`
- **emoji:** 📝
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Types: PascalCase. Regular variables: camelCase. Exported values: PascalCase. Parameters and object literal
props/methods: camelCase. Leading/trailing `_` forbidden except unused parameters.

## 🔍 Detect

Inspect declarations and exports.

## 🔧 Fix

Rename to match the convention

## 📝 Examples

### ❌ Bad

`type user = { UserName: string };`

### ✅ Good

`type User = { userName: string };`
