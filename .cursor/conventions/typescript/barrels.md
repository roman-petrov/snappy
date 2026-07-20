# 📦 Barrel files

- **id:** `typescript/barrels`
- **emoji:** 📦
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Use `index.ts` barrels in directories. In barrels only `export * from "./File"` / `"./folder"` — no named re-exports of
individuals. Parent barrels re-export children. Always import from barrels (package or directory), never from concrete
sibling files when a barrel exists.

## 🔍 Detect

Check for deep sibling imports and non-`export *` barrel lines.

## 🔧 Fix

Add/use barrel; switch imports to barrel paths

## 📝 Examples

### ❌ Bad

`import { run } from "./Module/Run";`

### ✅ Good

`import { run } from "./Module";`
