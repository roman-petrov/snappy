# 📦 Pure module

- **id:** `typescript/pure-module`
- **emoji:** 📦
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Export as an object of functions: `export const ModuleName = { fn1, fn2 }`. Never export individual functions
(exception: rare global helpers like `t`).

Declare each member as a local `const`, then list only those names in the export object. Do not put calls, inline
functions, or other expressions inside `export const ModuleName = { … }` (same shape as factory `return { … }` /
`typescript/simple-returns`).

## 🔍 Detect

Find individual `export function` / `export const fn` that should be namespaced. Find `export const X = {` with property
values that are not bare local names or spreads.

## 🔧 Fix

Hoist members to locals; group into one namespace export of names only

## 📝 Examples

### ❌ Bad

`export const add = (a: number, b: number) => a + b;`

```ts
export const Math = {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
};
```

### ✅ Good

```ts
const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;
export const Math = { add, subtract };
```
