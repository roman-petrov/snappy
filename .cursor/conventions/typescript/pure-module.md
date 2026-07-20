# 📦 Pure module

- **id:** `typescript/pure-module`
- **emoji:** 📦
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Export as an object of functions: `export const ModuleName = { fn1, fn2 }`. Never export individual functions
(exception: rare global helpers like `t`).

## 🔍 Detect

Find individual `export function` / `export const fn` that should be namespaced.

## 🔧 Fix

Group into one namespace export

## 📝 Examples

### ❌ Bad

`export const add = (a: number, b: number) => a + b;`

### ✅ Good

```ts
const add = (a: number, b: number) => a + b;
export const Math = { add };
```
