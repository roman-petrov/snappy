# ⚡ Arrow functions

- **id:** `typescript/arrow-functions`
- **emoji:** ⚡
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Use arrow functions everywhere, not `function` declarations.

## 🔍 Detect

Grep for `function `.

## 🔧 Fix

Convert to arrow / const arrow

## 📝 Examples

### ❌ Bad

`function run(n: number) { return n * 2; }`

### ✅ Good

`const run = (n: number) => n * 2;`
