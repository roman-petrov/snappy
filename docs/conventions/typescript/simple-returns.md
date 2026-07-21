# 🔀 Simple object returns

- **id:** `typescript/simple-returns`
- **emoji:** 🔀
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Prefer simple returns of local names. Define handlers and derived values above; in `return { … }` only list names or
spreads. Do not declare functions or heavy expressions inside the return. Do not rename in the return
(`return { onSubmit: process }` — return `process` under the same name).

## 🔍 Detect

Find `return {` with inline functions or renames.

## 🔧 Fix

Hoist to locals; return names/spreads only

## 📝 Examples

### ❌ Bad

`return { onSubmit: () => save(value) };`

### ✅ Good

```ts
const submit = () => save(value);
return { submit };
```
