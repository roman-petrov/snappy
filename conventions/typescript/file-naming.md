# 📁 File naming

- **id:** `typescript/file-naming`
- **emoji:** 📁
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Use PascalCase for `.ts`/`.tsx` files. Exceptions: `main`, `index`, `entry-*`, `locales/**`. Hook-only files use
camelCase (`useAsyncSubmit.ts`).

## 🔍 Detect

Check basename casing vs exceptions.

## 🔧 Fix

Rename the file; fix imports

## 📝 Examples

### ❌ Bad

`userForm.tsx`

### ✅ Good

`UserForm.tsx`
