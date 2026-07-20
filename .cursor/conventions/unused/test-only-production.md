# 🗑️ Test-only code in production

- **id:** `unused/test-only-production`
- **emoji:** 🗑️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

No helpers, flags, stubs, or branches in production modules that exist solely for tests (`export for tests`, `__test__`,
`if (process.env.TEST)`). Prefer testing through the public API.

## 🔍 Detect

Search for test-only seams in non-test files.

## 🔧 Fix

Delete or redesign a minimal intentional seam; fix tests to use the public API

## 📝 Examples

### ❌ Bad

`export const __test__ = { reset };`

### ✅ Good

Test only through the public API
