# 📘 ESLint disables at top

- **id:** `eslint/disables-at-top`
- **emoji:** 📘
- **applies:** `**/*.{js,ts,tsx,mjs,cjs}`

## 📐 Norm

File-level `eslint-disable` only at the top (before imports). One rule per line. No `-- reason`. Prefer file-top disable
over scattered `eslint-disable-next-line` for whole-file concerns.

## 🔍 Detect

Find mid-file disables, multi-rule comments, or `-- reason`.

## 🔧 Fix

Move to top; one rule per line; drop descriptions

## 📝 Examples

### ❌ Bad

```ts
import { run } from "./run";
// eslint-disable-next-line no-console
console.log(run());
```

### ✅ Good

```ts
/* eslint-disable no-console */
import { run } from "./run";
```
