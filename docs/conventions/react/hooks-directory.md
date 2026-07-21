# ⚛️ Hooks in hooks directory

- **id:** `react/hooks-directory`
- **emoji:** ⚛️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Hook modules must live in a directory named `hooks`. Hook file names use camelCase.

## 🔍 Detect

Find hook exports outside a `hooks/` path.

## 🔧 Fix

Move into `hooks/`; rename if needed

## 📝 Examples

### ❌ Bad

`components/useItem.ts`

### ✅ Good

`components/hooks/useItem.ts`
