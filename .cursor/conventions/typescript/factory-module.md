# 📦 Factory module

- **id:** `typescript/factory-module`
- **emoji:** 📦
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Factory takes deps as an object; `export type ModuleNameConfig`. Declare each method as local `const`, then
`return { … }`. Export `export type ModuleName = ReturnType<typeof ModuleName>`.

## 🔍 Detect

Find factories with inlined return methods or missing API/config types.

## 🔧 Fix

Extract local consts; add Config and ReturnType exports

## 📝 Examples

### ❌ Bad

```ts
export const Store = (config: Config) => ({
  read: () => config.seed,
});
```

### ✅ Good

```ts
export type StoreConfig = { seed: number };
export const Store = ({ seed }: StoreConfig) => {
  const read = () => seed;
  return { read };
};
export type Store = ReturnType<typeof Store>;
```
